# Обзор архитектуры

## 1. Как читать систему как единую идею

На первый взгляд проект выглядит как интерактивный Slider с аудиоплеером. Функционально это верное описание, но с архитектурной точки зрения оно неполно. Самое интересное начинается в тот момент, когда несколько разных областей взаимодействия должны сосуществовать, не превращая приложение в один огромный объект.

Поэтому архитектура начинается не с набора функций, а с вопроса о владении ответственностью. Slider владеет движением. AudioPlayer владеет воспроизведением. Shop владеет своей задачей внешней ссылки. Переиспользуемые механизмы - подписка на события, диспетчеризация клавиатуры, обработка кнопок и работа с временем - вынесены в менеджеры. Над ними находится `ShowcaseApp`, который координирует последствия, пересекающие границы компонентов.

```text
                         ┌────────────────────────────┐
                         │        USER / DOM          │
                         └──────────────┬─────────────┘
                                        │
                                        ▼
                         ┌────────────────────────────┐
                         │      ShowcaseApp           │
                         │ composition + policy       │
                         └──────────────┬─────────────┘
                                        │
              ┌─────────────────────────┼────────────────────────┐
              ▼                         ▼                        ▼
       ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
       │    Slider    │          │ AudioPlayer  │          │     Shop     │
       │ own state +  │          │ own state +  │          │ own external │
       │ behavior     │          │ behavior     │          │ link concern │
       └──────┬───────┘          └──────┬───────┘          └──────────────┘
              │                         │
              └────────────┬────────────┘
                           ▼
                  application events / policy
```

Такой взгляд объясняет, почему проект имеет больше структуры, чем обычный Slider. Каждый дополнительный слой появился потому, что возникла отдельная архитектурная ответственность, которой потребовалось собственное место.

## 2. Философия проектирования

Центральная философия проекта - **сложно, но контролируемо**, а не **минимально, но жёстко связано**. Это архитектурное учебное упражнение, поэтому проект намеренно исследует, что происходит, когда UI разложен на взаимодействующие объекты без использования фреймворка.

Цель не в абстракции ради самой абстракции. Полезна та абстракция, которая даёт концепции ясного владельца, устраняет дублирование механизма или создаёт переиспользуемый контракт. Поэтому система использует менеджеры, локальные FSM и pipeline, но намеренно не вводит принудительный глобальный State layer или универсальную обёртку вокруг каждой константы.

```text
A real concern appears
        │
        ▼
Give it a clear owner
        │
        ├── domain concern -> component
        └── reusable mechanism -> manager
        │
        ▼
Connect across boundaries through application policy/events
```

## 3. Архитектурные слои

Всё приложение можно рассматривать как пять взаимодействующих слоёв:

```text
┌─────────────────────────────────────────────────────┐
│ 1. Оркестрация приложения                           │
│    ShowcaseApp                                      │
├─────────────────────────────────────────────────────┤
│ 2. Доменные компоненты                              │
│    Slider / AudioPlayer / AudioDeckView / Shop     │
├─────────────────────────────────────────────────────┤
│ 3. Инфраструктура взаимодействия                    │
│    EventManager / KeyboardManager / ButtonManager  │
│    Timer                                            │
├─────────────────────────────────────────────────────┤
│ 4. Контракты / UI-поддержка                          │
│    DOMValidator / Button                            │
├─────────────────────────────────────────────────────┤
│ 5. Внутренние механизмы                              │
│    inheritance / polymorphism / FSM / _pipe        │
└─────────────────────────────────────────────────────┘
```

Остальная часть этого документа объясняет, зачем нужна такая декомпозиция и как её части взаимодействуют на высоком уровне.

# 4. Система с первого взгляда

```text
                         ┌───────────────────────┐
                         │     ShowcaseApp       │
                         │                       │
                         │ Composition +         │
                         │ Coordination          │
                         └───────────┬───────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
               ▼                     ▼                     ▼
        ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
        │    Slider    │      │ AudioPlayer  │      │     Shop     │
        │              │      │              │      │              │
        │ navigation   │      │ theme        │      │ external     │
        │ pagination   │      │ albums       │      │ links        │
        │ keyboard     │      │ tracks       │      │              │
        │ infinite     │      │ audio FSM    │      │              │
        │ dragging     │      │ controls     │      │              │
        │ autoscroll   │      │              │      │              │
        └──────┬───────┘      └──────┬───────┘      └──────────────┘
               │                     │
               │                     │
               └──────────┬──────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Custom events  │
                 │  + pipelines    │
                 └─────────────────┘
```

Главное правило выглядит просто:

```text
Компонент владеет своей доменной логикой
                 +
Менеджеры владеют переиспользуемыми механизмами взаимодействия
                 +
ShowcaseApp координирует взаимодействие компонентов
                 +
События и pipelines соединяют части
```

---

# 5. Основные архитектурные принципы

## Изоляция компонентов

Каждый крупный компонент владеет собственным состоянием и поведением.

```text
Slider
 ├── navigation
 ├── pagination
 ├── dragging
 ├── autoscroll
 └── slider/autoscroll state

AudioPlayer
 ├── playback
 ├── theme
 ├── album/track selection
 └── audio state

Shop
 └── external link state
```

`ShowcaseApp` координирует эти компоненты, но не проникает во внутреннюю реализацию каждого из них.

## Разделение ответственности

Ответственности намеренно распределены между:

```text
Application
    └── ShowcaseApp

Components
    ├── Slider
    ├── AudioPlayer
    ├── AudioDeckView
    └── Shop

Reusable infrastructure
    ├── EventManager
    ├── KeyboardManager
    ├── ButtonManager
    └── Timer

Validation / UI abstractions
    ├── DOMValidator
    └── Button

Utilities
    └── helpers
```

Именно поэтому кода больше, чем в минимальной реализации Slider: проект исследует архитектуру, а не только UI-механику.

## Конфигурация вместо дублирования

Правила взаимодействия там, где это полезно, задаются через configuration tables.

```text
configuration
      │
      ▼
┌───────────────────┐
│ Manager           │
│                   │
│ interpret config  │
│ validate contract │
│ build action map  │
└─────────┬─────────┘
          │
          ▼
       Component
```

Особенно хорошо это видно в keyboard, click и event handling.

## Fail-fast контракты

Проект предпочитает явную ошибку защитным попыткам угадать, что имелось в виду.

```text
Expected DOM
    │
    ▼
DOMValidator
    │
    ├── valid ───────► инициализация продолжается
    │
    └── invalid ─────► ошибка сразу
```

Если обязательная DOM-зависимость нарушена, архитектура предпочитает обнаружить это рядом с источником проблемы, а не маскировать её запасными селекторами.

---

# 6. Композиция приложения

`ShowcaseApp` является composition root.

Он получает основные компоненты и отвечает за их инициализацию, wiring и application-level coordination.

```text
                    ShowcaseApp
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
      Slider        AudioPlayer          Shop
        │                │
        └───────┬────────┘
                ▼
        cross-component
          coordination
```

Его ответственности находятся на уровне приложения:

```text
создание и инициализация
регистрация event maps
маршрутизация общего browser input
реакция на component events
синхронизация Slider и AudioPlayer
координация визуальных режимов
```

Он не реализует сам механизм перемещения Slider или механизм воспроизведения AudioPlayer.

Это и есть практическое применение Inversion of Control и Dependency Injection: composition выполняется на границе приложения, а не внутри доменных компонентов.

---

# 7. Компоненты не владеют друг другом напрямую

Нежелательная зависимость выглядела бы так:

```text
Slider ───────────────► AudioPlayer
   │
   └──────────────────► Shop
```

Предпочтительный вариант:

```text
Slider ───────┐
AudioPlayer ──┼──► ShowcaseApp ───► application decision
Shop ─────────┘
```

Например:

```text
slidechange
     │
     ▼
ShowcaseApp
   ├── Shop.setActiveIndex()
   └── AudioPlayer.switchAlbum()
```

Slider сообщает только:

```text
"активный slide изменился"
```

Ему не нужно знать, что такое album или purchase link.

Поэтому `ShowcaseApp` можно описывать как **Mediator-like координатор уровня приложения**. Его задача - держать cross-component правила в одном месте, не перетаскивая внутрь себя доменную логику компонентов.

---

# 8. Архитектура Slider

Slider строится последовательно через inheritance.

```text
┌──────────────────────┐
│      BaseSlider      │
│                      │
│ core slider engine   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   PaginationSlider   │
│                      │
│ pagination           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    KeyboardSlider    │
│                      │
│ keyboard interaction │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    InfiniteSlider    │
│                      │
│ clone/teleport loop  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    DraggableSlider   │
│                      │
│ pointer dragging     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   AutoscrollSlider   │
│                      │
│ automatic movement   │
└──────────────────────┘
```

Каждый уровень добавляет одну возможность или специализирует существующий алгоритм.

Это пример **capability-based extension через inheritance и polymorphism**, а там, где базовый класс задаёт общий алгоритм с точками расширения, структура также носит Template Method-like характер.

---

# 9. Локальные конечные автоматы

Проект сознательно не использует одну глобальную state machine.

```text
                 ShowcaseApp
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Slider FSM           AudioPlayer FSM
          │
          ▼
   Autoscroll FSM
```

Есть три осмысленных state domains:

```text
1. движение Slider
2. управление autoscroll
3. режим воспроизведения AudioPlayer
```

Компонент, который владеет состоянием, владеет и его смыслом и переходами.

---

# 10. FSM Slider

```text
              navigation / drag
           ┌──────────────────────┐
           │                      ▼
        ┌───────┐             ┌────────┐
        │ IDLE  │────────────►│ MOVING │
        └───────┘             └────┬───┘
           ▲                       │
           │  transition complete  │
           └───────────────────────┘
```

Главное различие:

```text
MOVING ≠ slidechange
```

`MOVING` означает процесс движения, тогда как `slidechange` означает, что активный slide уже считается изменённым с точки зрения приложения.

---

# 11. FSM Autoscroll

```text
                    enable
               ┌──────────────►┐
               │               │
            ┌──────┐        ┌──────┐
            │ OFF  │        │  ON  │
            └──┬───┘        └──┬───┘
               ▲               │
               │               │ temporary blocking
               │               ▼
               │           ┌────────┐
               └───────────│ LOCKED │
                  disable  └────────┘
```

У `OFF` и `LOCKED` разный смысл:

```text
OFF    = autoscroll отключён
LOCKED = autoscroll существует, но временно не может работать
```

Это особенно важно во время album playback.

---

# 12. FSM AudioPlayer

```text
             ┌─────────────┐
             │    IDLE     │
             └──────┬──────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     ┌─────────┐        ┌──────────┐
     │  THEME  │        │  ALBUM   │
     └────┬────┘        └────┬─────┘
          │                   │
          └──────────┬────────┘
                     ▼
               ┌────────────┐
               │ ALBUMTHEME │
               └────────────┘
```

Здесь state означает не просто native `<audio>` status, а семантический playback context приложения.

---

# 13. Input Pipeline

Одна из характерных архитектурных идей проекта - `_pipe` interaction model.

```text
Browser input
      │
      ▼
ShowcaseApp
      │
      ▼
_stream()
      │
      ▼
_pipe()
      │
      ├── Slider
      ├── AudioPlayer
      └── Shop
```

Порядок может меняться.

```text
NORMAL
Slider -> AudioPlayer -> Shop

REVERSE
AudioPlayer -> Slider -> Shop
```

Return value является небольшим control protocol:

```text
true
  └── событие поглощено -> stop

original Event
  └── событие не обработано -> continue

other result
  └── application/component-specific meaning
```

Поэтому pipeline можно рассматривать как лёгкую форму **Chain of Responsibility**.

---

# 14. Keyboard Pipeline

`KeyboardManager` классифицирует key event, `ShowcaseApp` определяет application-level routing, а компонент выполняет доменную операцию.

```text
KeyboardEvent
      │
      ▼
KeyboardManager
      │
      ▼
ShowcaseApp
      │
      ├───────────────┐
      ▼               ▼
normal order       reverse order
      │               │
      ▼               ▼
Slider -> Audio     Audio -> Slider
      │               │
      └───────┬───────┘
              ▼
             Shop
```

Reverse-порядок нужен для специальных ситуаций, в которых AudioPlayer должен получить возможность обработать ввод раньше Slider.

---

# 15. Менеджеры

Менеджеры являются центральным инфраструктурным слоем.

```text
             ┌─────────────────────┐
             │      Managers       │
             └──────────┬──────────┘
                        │
       ┌────────────────┼─────────────────┐
       ▼                ▼                 ▼
EventManager      KeyboardManager    ButtonManager
       │                │                 │
       └────────────────┼─────────────────┘
                        ▼
                       Timer
```

Главный принцип:

```text
Manager    = переиспользуемый механизм
Component  = доменный смысл
```

Именно поэтому `KeyboardManager` не должен знать, что такое album, а `EventManager` - что такое dragging.

---

# 16. EventManager

`EventManager` предоставляет декларативную event routing infrastructure.

Он поддерживает:

```text
static event maps
dynamic subscriptions
subscription / unsubscription
handler dispatch
target resolution
contract validation
```

### Declarative static maps

```text
component constructor
        │
        ▼
 static EVENT_MAP
        │
        ▼
 EventManager
        │
        ▼
 DOM subscription
```

### Dynamic subscriptions

```text
Normal mode
    │
    ▼
Drag starts
    │
    ▼
dynamic subscriptions added
    │
    ▼
drag interaction
    │
    ▼
Drag ends
    │
    ▼
dynamic subscriptions removed
```

Так EventManager становится местом, где сосредоточена инфраструктурная логика событий, а не доменная логика конкретного компонента.

---

# 17. KeyboardManager и ButtonManager

Оба менеджера реализуют близкую архитектурную идею:

```text
configuration
     │
     ▼
lookup / normalization
     │
     ▼
handler contract validation
     │
     ▼
runtime action table
     │
     ▼
component method
```

`KeyboardManager` работает с keyboard configuration, `ButtonManager` - с button/action mapping.

Компонент владеет смыслом команды; менеджер владеет механизмом её поиска и вызова.

---

# 18. Button

`Button` представляет UI-action в унифицированной форме.

```text
DOM interaction
      │
      ▼
    Button
      │
      ▼
 execute(event)
      │
      ▼
component command
```

Это корректнее называть **Command-like abstraction**, а не пытаться выдавать его за textbook Command implementation.

---

# 19. Другая инфраструктура

### Timer

```text
AutoscrollSlider
      │
      ▼
    Timer
      │
   delay/callback
      │
      ▼
autoscroll action
```

`Timer` не знает, что такое slide. Он владеет timing mechanism.

### DOMValidator

```text
Component
 │
 ▼
DOMValidator
 │
 ├── valid   -> continue
 └── invalid -> fail fast
```

### AudioDeckView

```text
AudioPlayer
     │
     ▼
custom events
     │
     ▼
ShowcaseApp
     │
     ▼
AudioDeckView
     │
     ▼
DOM
```

View отображает информацию, но не владеет playback state.

---

# 20. Карта архитектурных паттернов

Проект использует несколько узнаваемых паттернов и принципов, но не все они являются textbook GoF implementations.

| Паттерн / принцип | Где | Назначение |
|---|---|---|
| Mediator-like | `ShowcaseApp` | координация независимых компонентов |
| Observer / Pub-Sub-like | custom events + `EventManager` | событийная связь без прямого знания подписчиков |
| Chain of Responsibility | `_pipe` / propagation | обработчики могут поглотить или передать ввод дальше |
| Strategy-like | configurable managers | действие выбирается через configuration |
| Template Method-like | slider inheritance | общий алгоритм + полиморфные точки расширения |
| Command-like | `Button` | представление исполняемого UI-действия |
| FSM | Slider / Autoscroll / AudioPlayer | локализация состояния и переходов |
| Composition | `ShowcaseApp` | сборка системы из независимых частей |
| Dependency Injection | application construction | внешняя передача зависимостей |
| Inversion of Control | composition root | разделение composition и domain logic |
| Polymorphism | slider hierarchy / static contracts | специализация поведения без дублирования |

Важно различать названия:

```text
DI       = архитектурная техника
IoC      = более широкий архитектурный принцип
FSM      = техника моделирования состояния
Pub/Sub  = стиль событийной коммуникации
Factory  = использовать только там, где действительно присутствует соответствующая abstraction
```

---

# 21. Почему здесь нет глобального State Pattern

У компонентов уже есть ясные владельцы состояния:

```text
BaseSlider
    └── IDLE / MOVING

AutoscrollSlider
    └── OFF / ON / LOCKED

AudioPlayer
    └── IDLE / ALBUM / THEME / ALBUMTHEME
```

Глобальный State object стал бы вторым владельцем той же информации и увеличил бы coupling.

```text
local state ownership
        >
global state registry
```

Отдельная иерархия State objects могла бы стать полезной в будущем, если state-specific behavior вырастет настолько, что локальная модель перестанет быть удобной.

---

# 22. Взаимодействие архитектурных механизмов

Самое интересное в архитектуре - не количество паттернов, а то, как они соединяются.

```text
Browser
   │
   ▼
EventManager
   │
   ▼
ShowcaseApp
   │
   ▼
Keyboard/Button Manager
   │
   ▼
Command-like action
   │
   ▼
Pipeline
   │
   ▼
Polymorphic component
   │
   ▼
FSM / domain state
   │
   ▼
Custom event
   │
   ▼
ShowcaseApp
   │
   ▼
cross-component consequence
```

Один пользовательский ввод может пройти через несколько архитектурных механизмов, при этом каждый сохраняет узкую ответственность.

---

# 23. Архитектурная философия

Проект сознательно выбирает:

```text
complex but controllable
          over
minimal but tightly coupled
```

Дополнительные абстракции существуют ради исследования:

```text
границ компонентов
полиморфизма
наследования
FSM
переиспользуемых менеджеров
event routing
configuration
validation
application mediation
```

Поэтому архитектуру полезнее оценивать не вопросом:

```text
"Можно ли было написать меньше?"
```

а вопросом:

```text
"Создаёт ли эта дополнительная структура
реальную ответственность, границу или механизм?"
```

---

# 24. Финальная архитектура

```text
                         ┌──────────────────────────────┐
                         │        ShowcaseApp            │
                         │  Composition + Coordination   │
                         └──────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              ▼                         ▼                          ▼
       ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
       │    Slider    │          │ AudioPlayer  │          │     Shop     │
       │              │          │              │          │              │
       │ Slider FSM   │          │ Audio FSM    │          │ external URL │
       └──────┬───────┘          └──────┬───────┘          └──────────────┘
              │                         │
              ▼                         ▼
       ┌──────────────┐          ┌──────────────┐
       │ inheritance  │          │ AudioDeckView│
       │ + pipelines  │          │ rendering    │
       └──────┬───────┘          └──────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ Reusable infrastructure                             │
│                                                     │
│ EventManager | KeyboardManager | ButtonManager     │
│ Timer        | DOMValidator    | Button            │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
               input / event pipelines
                         │
                         ▼
             polymorphism + local FSMs
```

## Summary

Архитектура складывается из пяти взаимодействующих concerns:

```text
1. Оркестрация приложения
   └── ShowcaseApp

2. Доменные компоненты
   ├── Slider
   ├── AudioPlayer
   ├── AudioDeckView
   └── Shop

3. Переиспользуемая инфраструктура взаимодействия
   ├── EventManager
   ├── KeyboardManager
   ├── ButtonManager
   └── Timer

4. Валидация / UI abstractions
   ├── DOMValidator
   └── Button

5. Внутренняя архитектура компонентов
   ├── FSMs
   ├── inheritance
   ├── polymorphism
   └── input pipelines
```

Центральный архитектурный принцип:

```text
Компоненты владеют поведением и состоянием.
Менеджеры владеют переиспользуемыми механизмами.
ShowcaseApp владеет композицией и межкомпонентной координацией.
События и pipelines соединяют слои,
не раскрывая лишние детали реализации.
```
