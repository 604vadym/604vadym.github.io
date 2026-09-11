# Подробный разбор архитектуры

> Это implementation-level companion к `Architecture-Overview.md`. Его задача - объяснить не только, что делает каждая часть, но и зачем она существует, чем владеет, какой контракт предоставляет, как взаимодействует с соседями и как участвует в общих runtime-flow.

---

# 1. Модель чтения архитектуры

Систему проще всего понимать снаружи внутрь:

```text
APPLICATION
    │
    ▼
ShowcaseApp
    │
COMPONENTS
    │
    ├── Slider
    ├── AudioPlayer
    ├── AudioDeckView
    └── Shop
    │
INFRASTRUCTURE
    │
    ├── EventManager
    ├── KeyboardManager
    ├── ButtonManager
    ├── Timer
    ├── DOMValidator
    └── Button
    │
INTERNAL MECHANICS
    │
    ├── inheritance
    ├── polymorphism
    ├── FSMs
    ├── pipelines
    ├── DOM lifecycle
    └── media lifecycle
```

Главный вопрос на всём протяжении документа остаётся одним: **почему существует эта часть, чем она владеет и как она сотрудничает с соседними частями, не забирая их ответственность?**

---

# 3. Runtime object graph

Упрощённый runtime graph выглядит так:

```text
                           ShowcaseApp
                         /      |       \
                        /       |        \
                       ▼        ▼         ▼
                    Slider   AudioPlayer  Shop
                      │           │
                      │           └────► AudioDeckView
                      │
              ┌───────┼────────┐
              ▼       ▼        ▼
         EventMgr  Keyboard  ButtonMgr
                         \\      /
                          \\    /
                           Timer

                  DOMValidator
                       │
                       └── explicit DOM contracts
```

Точная ownership-модель менеджеров следует границам компонентов и приложения, а не глобальному service locator.

---

# 4. `ShowcaseApp`: constructor и composition

Приложение получает основные компоненты:

```text
slider
audioPlayer
audioDeckView
shop
options
```

и создаёт инфраструктуру уровня приложения:

```text
_domValidator
_keyboardManager
_eventManager
```

Общая идея:

```text
construction
     │
     ▼
composition root
     │
     ├── получить / передать компоненты
     ├── создать инфраструктуру
     └── выполнить initialization
```

Это практическое место, где встречаются IoC и composition.

---

# 5. Порядок инициализации `ShowcaseApp`

Порядок инициализации имеет значение.

```text
ShowcaseApp.init()
     │
     ├── _initDOMElements()
     │
     ├── _initProps()
     │
     ├── slider.init()
     │
     ├── audioPlayer.init()
     │
     ├── audioDeckView.init()
     │
     ├── shop.init()
     │
     ├── keyboardManager.init()
     │
     └── eventManager.init()
```

Получается жизненный цикл:

```text
dependencies available
        v
DOM available
        v
component state initialized
        v
component event contracts established
        v
application routing activated
```

---

# 6. Состояние уровня приложения

`ShowcaseApp` хранит только то состояние, которое нужно для координации.

Например:

```text
_isSliderMoving
_btnNoActive
```

Он не дублирует:

```text
slider current index
autoscroll FSM
audio current track
audio playback mode
```

Они остаются у своих владельцев.

Это один из самых важных ownership boundaries в архитектуре.

---

# 7. Application Event Map

Основная карта событий включает browser events и component-generated custom events.

```text
Browser
────────────────────────────────────
click
auxclick
keydown
keyup
mousedown

Slider
────────────────────────────────────
viewportclick
slidemove
slidechange
autoscrollchange

AudioPlayer
────────────────────────────────────
albumplay
albumpause
albumplaypassthrough
albumend
audiotrackchange
timechange
```

Каждый route описывает:

```text
target
handler
optional event options
```

`EventManager` превращает эту декларацию в реальные subscriptions.

---

# 8. `_stream()` и `_pipe()`

У этих методов разные ответственности.

```text
_stream()
    │
    └── выбирает порядок pipeline

_pipe()
    │
    └── исполняет выбранный pipeline
```

Обычный вариант:

```text
[ Slider, AudioPlayer, Shop ]
```

Специальный reverse-вариант:

```text
[ AudioPlayer, Slider, Shop ]
```

Сам цикл находится в `_pipe()`.

```text
for component in pipeline
    │
    ├── value всё ещё Event?
    │       └── иначе -> вернуть его
    │
    └── у component есть handler?
            ├── нет -> следующий component
            └── да  -> handler(event)
```

Так выбор порядка отделён от механики исполнения pipeline.

---

# 9. Return protocol `_pipe()`

Это один из самых интересных небольших архитектурных механизмов проекта.

```text
handler(event)
      │
      ▼
    result
      │
 ┌────┼───────────────────┐
 ▼    ▼                   ▼
true Event             other value
 │      │                  │
 │      └── continue       └── semantic result
 └── consume
```

Если handler возвращает:

```js
true
```

верхний уровень может интерпретировать событие как поглощённое.

Если action/manager не возвращает результат, исходный event сохраняется:

```js
return request?.action(...) ?? e;
```

Таким образом:

```text
original event
```

становится continuation token.

Именно поэтому pipeline остаётся небольшим: для него не потребовался отдельный `PipelineResult` object.

---

# 10. `_pressStep()` и keyboard modes приложения

Сначала keydown проходит через keyboard manager.

Затем `ShowcaseApp` может классифицировать результат в application-level modes:

```text
REVERSE
REPEAT_FILTERED
REPEAT_ALLOWED
ordinary Event
```

Упрощённо:

```text
keydown
   │
   ▼
KeyboardManager.manage()
   │
   ▼
pressStep
   │
   ├── repeat + special passthrough
   │       └── REPEAT_ALLOWED
   │
   ├── ordinary repeat
   │       └── REPEAT_FILTERED
   │
   ├── active album passthrough
   │       └── REVERSE
   │
   └── normal
           └── Event
```

Менеджер распознаёт действие, а application layer решает, как особый ввод должен распространяться по всей системе.

---

# 11. Repeat filtering

Повторный keydown не обрабатывается одним универсальным правилом.

Приложение проверяет:

```text
e.repeat
```

и учитывает текущее audio/passthrough состояние.

```text
repeat?
   │
   ├── no -> normal processing
   │
   └── yes
        │
        ├── special allowed condition -> allow
        │
        └── otherwise -> filter
```

Это позволяет long-running key press вести себя иначе, чем одноразовое действие.

---

# 12. Reverse input routing

Во время активного album playback специальный passthrough key может требовать, чтобы AudioPlayer получил событие раньше Slider.

```text
normal
───────────────
Slider -> AudioPlayer -> Shop

reverse
───────────────
AudioPlayer -> Slider -> Shop
```

Это одна из причин, почему фиксированной цепочки было бы недостаточно.

Порядок pipeline сам становится частью application policy.

---

# 13. Keyboard commands

Приложение использует набор semantic commands.

Для Slider это концептуально:

```text
next
prev
autoscrolloff
execute
toggleautoscroll
reset
ignore
```

Для AudioPlayer:

```text
next track
previous track
play
pause
toggle
restart
track selection
album selection
```

Клавиши браузера являются input data:

```text
ArrowRight
KeyD
Enter
Space
Escape
...
```

Менеджер переводит физический input в semantic action.

---

# 14. Numeric / Shift audio track selection

Прямой выбор track поддерживается через key input.

```text
keyboard symbol
      │
      ▼
track-number mapping
      │
      ▼
audioTrackInQueue setter
      │
      ▼
validated track index
```

Таким образом, валидность queue position остаётся ответственностью `AudioPlayer`, а не каждого caller.

---

# 15. Auxiliary mouse handling

Application layer различает:

```text
left
middle
right
```

В частности, right click игнорируется в auxiliary-click flow. Middle click может преобразовываться в обычный application click, если он пришёл с interactive target.

Это этап нормализации браузерной семантики:

```text
native mouse semantics
        v
application semantics
        v
component pipeline
```

---

# 16. Временное состояние правой кнопки

При right mousedown над кнопкой применяется временный visual class.

```text
right mousedown
      │
      ▼
find button
      │
      ▼
remember _btnNoActive
      │
      ▼
apply jsClasses.btnNoActive
      │
      ▼
dynamic mouseleave subscription
```

На mouseleave:

```text
remove visual class
unsubscribe dynamic event
clear _btnNoActive
```

Это конкретный пример temporary application state + dynamic EventManager subscriptions.

---

# 17. Визуальное состояние keyboard press

После успешно поглощённого keyboard action:

```text
keydown
   │
   ▼
pipeline
   │
   ▼
result === true
   │
   ▼
active element
   │
   ▼
keyboard pressed CSS state
```

`keyup` снимает визуальное состояние.

Таким образом visual feedback является следствием semantic command result, а не отдельной реализацией в каждом component.

---

# 18. `BaseSlider` - граница ответственности

`BaseSlider` владеет общим Slider engine.

Его область включает:

```text
DOM discovery
slide collection
index management
track movement
navigation
transition state
resize handling
common event map
button primitives
```

Поздние subclasses используют этот stable base contract.

Финальный Slider всё ещё предоставляет высокоуровневые команды:

```text
next()
prev()
goto()
```

несмотря на дополнительные уровни поведения.

---

# 19. Состояние базового Slider

```text
                navigation
                    │
                    ▼
               ┌────────┐
               │ MOVING │
               └────┬───┘
                    │ transition end
                    ▼
                 ┌──────┐
                 │ IDLE │
                 └──────┘
```

Setter состояния валидирует state token.

В polymorphic варианте архитектуры он может разрешать таблицу состояний через:

```js
this.constructor.STATES[stateKey]
```

Это осмысленное место для runtime-class static polymorphism.

---

# 20. Lifecycle движения Slider

Концептуальная последовательность:

```text
next / prev / goto
       │
       ▼
change logical index
       │
       ▼
slidemove
       │
       ▼
move track
       │
       ▼
transition
       │
       ▼
transitionend
       │
       ▼
slidechange
```

Проект намеренно разделяет:

```text
movement started
```

и:

```text
active slide committed
```

---

# 21. Почему это различие важно

Например, небольшой drag может двигать track, не меняя active slide.

```text
small drag
   │
   ▼
track moved
   │
   └── threshold not reached
              │
              ▼
       active slide unchanged
```

Поэтому нельзя приравнивать:

```text
track movement = slidechange
```

Это особенно важно для synchronization Slider <-> AudioPlayer <-> Shop.

Несколько пикселей движения не должны переключать album.

Этот случай стал хорошим примером того, как чёткая архитектурная граница помогает найти и исправить реальный поведенческий bug.

---

# 22. `PaginationSlider`

Pagination создаётся из данных о количестве slides.

```text
slides.length
      │
      ▼
create controls
      │
      ▼
store _paginationDots
      │
      ▼
activate matching indicator
```

Это хороший пример data-dependent UI.

Постоянные navigation controls имеют другой жизненный цикл и не обязаны динамически генерироваться только ради одинакового стиля.

Принцип:

```text
data-dependent UI -> generate from data
fixed UI          -> can remain in markup
```

---

# 23. Pagination и index synchronization

Committed index change проходит через inherited hooks и приводит к обновлению pagination state.

```text
slide index changes
       │
       ▼
parent/base handling
       │
       ▼
pagination override
       │
       ▼
deactivate old dot
       │
       ▼
activate current dot
```

Pagination layer не дублирует Slider movement algorithm.

---

# 24. `KeyboardSlider`

`KeyboardSlider` связывает Slider semantics с reusable `KeyboardManager`.

Разделение такое:

```text
KeyboardManager
    = key recognition + command routing

KeyboardSlider
    = slider meaning of commands
```

Поток:

```text
ArrowRight
    v
KeyboardManager
    v
next
    v
Slider method
    v
next slide
```

Компонент остаётся владельцем результирующих state changes.

---

# 25. Keyboard configuration как Strategy-like механизм

Keyboard mapping задаётся как configuration.

```text
next  -> ArrowRight / D
prev  -> ArrowLeft  / A
...
```

Менеджеру не нужен отдельный алгоритм для каждого компонента.

```text
same manager
      │
      ├── slider config
      ├── audio config
      └── app config
```

Поэтому behavior selection происходит через data, что напоминает Strategy pattern.

---

# 26. `InfiniteSlider`

Infinite loop строится на clone boundary slides.

```text
             real slides
     ┌─────────────────────────────┐
     ▼                             ▼

[last clone] [1] [2] ... [N] [first clone]
```

Clone positions существуют только для визуально непрерывного движения через границу.

---

# 27. Infinite loop teleport

На границах DOM index и logical index расходятся.

```text
DOM index
    │
    ├── 0         -> last clone
    ├── 1..N      -> real slides
    └── N + 1     -> first clone

logical index
    │
    └── 0..N-1    -> real slide identity
```

При достижении clone boundary:

```text
boundary clone
      │
      ▼
reset/teleport
      │
      ▼
corresponding real slide
```

Остальная система не знает, что clone вообще существует.

---

# 28. Index normalization

Смысл inheritance здесь в том, что базовый API может оставаться тем же, а Slider слой меняет физическое значение index.

```text
BaseSlider
   │
   └── normal index logic

InfiniteSlider
   │
   └── specialized normalization
```

Внешний код по-прежнему использует:

```text
next()
prev()
goto(index)
```

не зная о clone slides.

---

# 29. `DraggableSlider` lifecycle

Drag добавляет прямое управление указателем.

```text
pointerdown
      │
      ▼
_startDragging()
      │
      ├── record initial coordinates
      ├── modify track animation
      ├── pause conflicting autoscroll
      └── subscribe dynamic events
      │
      ▼
pointermove
      │
      ▼
move track with pointer
      │
      ▼
pointerup
      │
      ▼
_stopDragging()
```

---

# 30. Drag trigger threshold

Drag не обязан менять slide автоматически.

Финальное смещение сравнивается с threshold, зависящим от геометрии.

```text
trigger threshold
      =
current slide width
      ×
configured coefficient
```

Это лучше, чем один жёсткий pixel constant, особенно после resize.

---

# 31. `AutoscrollSlider`

Autoscroll добавляет поверх dragging собственную подсистему:

```text
autoscroll timer
autoscroll state
pause conditions
lock/unlock
wake-up timing
automatic-action marker
```

Timer остаётся generic:

```text
Timer
  │
  └── callback -> Slider._nextAuto()
```

Slider решает, что означает callback.

---

# 32. Autoscroll State Machine

Семантика состояний:

```text
OFF
    automatic motion disabled

ON
    automatic motion allowed

LOCKED
    automatic motion temporarily prohibited
```

```text
OFF ──enable──► ON
 ▲              │
 │              │ lock
 │              ▼
 └──disable── LOCKED
```

---

# 33. Почему `LOCKED` не равен `OFF`

```text
OFF
= возможность отключена

LOCKED
= возможность существует, но временно запрещена условием
```

Например:

```text
album playing
      │
      ▼
lock autoscroll
      │
      ▼
play album without competing motion
```

При паузе или завершении album приложение может решить, разрешать ли resume.

---

# 34. Autoscroll resume gate

Автозапуск после взаимодействия не происходит автоматически.

```text
interaction completed
       │
       ▼
_tryResumeAutoscroll()
       │
       ├── disabled?      -> stop
       ├── locked?        -> stop
       ├── dragging?      -> stop
       ├── blocked target?-> stop
       ├── hidden tab?    -> stop
       │
       └── allowed
              │
              ▼
         restart timer
```

Централизация этих условий защищает код от множества разрозненных `start()` calls.

---

# 35. Autoscroll wake-up timing

Различаются normal interval и restart/wake-up delay.

```text
current slide
    │
    ├── visible for time T
    │
    ▼
interaction pauses timer
    │
    ▼
interaction ends
    │
    ▼
remaining / adjusted wake-up delay
    │
    ▼
normal autoscroll cycle
```

Смысл в том, чтобы hover или другое временное взаимодействие не сбрасывали весь интервал отображения slide без причины.

---

# 36. Automatic vs manual movement

Slider хранит контекст автоматического запуска:

```text
_isAutoscrollAction
```

Условно:

```text
manual movement
      │
      └── normal interaction logic

automatic movement
      │
      └── _isAutoscrollAction = true
```

Это предотвращает применение manual-only side effects к движениям, инициированным autoscroll.

---

# 37. Autoscroll + dragging

Обе функции пытаются управлять одним track.

```text
autoscroll ON
      │
      ▼
drag starts
      │
      ├── automatic movement suspended
      ├── direct pointer movement enabled
      └── temporary subscriptions
      │
      ▼
drag ends
      │
      ▼
_tryResumeAutoscroll()
```

Это ещё одна причина, по которой autoscroll state должен быть более выразительным, чем boolean.

---

# 38. `AudioPlayer` - граница домена

`AudioPlayer` является отдельным stateful component.

Он владеет:

```text
native Audio object
theme playback
album playback
track selection
album selection
playback commands
playlist progression
media-session behavior
audio FSM
```

Остальные компоненты не должны напрямую менять:

```text
audio.src
audio.currentTime
audio state
playlist indices
```

Они используют semantic commands.

---

# 39. Public command surface AudioPlayer

Концептуальный API включает:

```text
play()
pause()
toggle()

playTheme()
resetTheme()

nextAudioTrack()
prevAudioTrack()
switchAudioTrack()

nextAlbum()
prevAlbum()
switchAlbum()

restartAudioTrack()
restartAlbum()
restartPlaylist()

rewindAudioTrack()
rewindAlbum()
rewindPlaylist()

stopAudioTrack()
stopAlbum()
stopPlaylist()
```

Главный принцип:

```text
public semantic operation
        >
native media implementation detail
```

---

# 40. AudioPlayer FSM

Player моделирует application-level playback modes.

```text
                ┌────────┐
                │  IDLE  │
                └───┬────┘
             ┌──────┴──────┐
             ▼             ▼
        ┌────────┐    ┌────────┐
        │ THEME  │    │ ALBUM  │
        └────┬───┘    └────┬───┘
             └──────┬──────┘
                    ▼
              ┌───────────┐
              │ALBUMTHEME │
              └───────────┘
```

Это не просто mirror native `<audio>` state. Это semantic mode model приложения.

---

# 41. Почему native Audio state недостаточно

`audio.paused` не говорит, что именно было поставлено на паузу:

```text
paused main theme
```

или:

```text
paused album
```

Для браузера оба случая означают paused. Для приложения - нет.

Поэтому:

```text
native media state
       +
application playback context
       v
AudioPlayer FSM
```

Это частный случай общего принципа: browser state не всегда совпадает с domain state.

---

# 42. Album и track indices

Player хранит отдельные позиции:

```text
album index
     │
     ▼
current album

track index
     │
     ▼
current track inside album
```

`audioTrackInQueue` setter валидирует и нормализует queue position.

Это сохраняет инвариант:

```text
internal queue index is valid
```

---

# 43. Audio event model

AudioPlayer публикует custom events:

```text
albumplay
albumpause
albumplaypassthrough
albumend
audiotrackchange
timechange
```

Например:

```text
AudioPlayer
      │
      └── audiotrackchange
               │
               ▼
          ShowcaseApp
               │
               ▼
        AudioDeckView
```

Для timeline:

```text
native timeupdate
          │
          ▼
      AudioPlayer
          │
          └── timechange
                 │
                 ▼
            ShowcaseApp
                 │
                 ▼
          AudioDeckView
```

---

# 44. Slider <-> Audio synchronization

Точка синхронизации - `slidechange`.

```text
Slider
   │
   └── slidechange
          │
          ▼
     ShowcaseApp
       ├── Shop.setActiveIndex(index)
       └── AudioPlayer.switchAlbum(index)
```

Slider сообщает только о смене logical slide identity.

Он не знает об альбомах, артистах или магазинах.

---

# 45. Почему `slidechange` является synchronization event

Небольшой drag может двигать track без изменения active slide.

Поэтому неверно синхронизировать album при каждом физическом movement.

Нужно дождаться semantic event:

```text
slidechange
```

Так boundary между physical movement и semantic change становится защитой от ошибочной синхронизации.

---

# 46. Audio -> Slider synchronization

При старте album playback:

```text
AudioPlayer
      │
      └── albumplay
              │
              ▼
         ShowcaseApp
              │
              ▼
       Slider.lockAutoscroll()
```

При паузе:

```text
AudioPlayer
      │
      └── albumpause
              │
              ▼
         ShowcaseApp
              │
              ▼
      Slider.unlockAutoscroll()
```

AudioPlayer не знает internals Slider.

---

# 47. Album passthrough event

Особое playback/input condition может привести к:

```text
albumplaypassthrough
```

Application layer может преобразовать это в изменение autoscroll policy:

```text
AudioPlayer
      │
      ▼
albumplaypassthrough
      │
      ▼
ShowcaseApp
      │
      ▼
Slider.disableAutoscroll()
```

---

# 48. Album end

Когда альбом заканчивается:

```text
AudioPlayer
      │
      └── albumend
              │
              ▼
         ShowcaseApp
```

Приложение переводит это в navigation command.

Если document active:

```text
Slider.next()
```

Если document inactive:

```text
Slider.nextInstantly()
```

Так application layer учитывает runtime environment.

---

# 49. Input modes в `ShowcaseApp`

Keyboard handling включает не только key lookup.

Учитываются:

```text
repeat event
passthrough condition
modifier state
reverse routing
execute mode
toggle mode
```

Концептуально:

```text
keydown
  │
  ▼
KeyboardManager.manage()
  │
  ▼
mode
  │
  ├── REPEAT_FILTERED
  ├── REPEAT_ALLOWED
  ├── REVERSE
  └── normal Event
```

---

# 50. Special repeat behavior

Not every repeat event is treated одинаково.

```text
repeat
   │
   ├── allowed for this mode
   │       └── continue
   │
   └── not allowed
           └── prevent/filter
```

Это позволяет специально разрешать те действия, где повторение действительно имеет смысл.

---

# 51. Reverse pipeline

`_stream()` выбирает порядок, а `_pipe()` исполняет его.

```text
normal
Slider -> AudioPlayer -> Shop

reverse
AudioPlayer -> Slider -> Shop
```

Это отделяет routing policy от механики итерации по pipeline.

---

# 52. `_pipe()` как контракт

Pipeline проходит по компонентам и обновляет текущий event/result.

```text
does component have handler?
        │
        ├── no -> skip
        │
        └── yes
             │
             ▼
        handler(event)
             │
             ▼
          result
```

Интерпретация:

```text
true
    -> consumed

original Event
    -> continue

other result
    -> component/application-specific result
```

---

# 53. Почему это похоже на Chain of Responsibility

Структура не является textbook GoF class hierarchy с базовым `Handler`.

Но принцип совпадает:

```text
handler A
   │
   ├── handles -> stop
   │
   └── does not handle -> handler B
```

Поэтому точнее называть это лёгким Chain-of-Responsibility protocol через pipeline и polymorphic handlers.

---

# 54. Inheritance + parent handler cooperation

Specialized handler может сохранить parent logic и добавить собственную.

```text
Child handler
     │
     ▼
Parent handler
     │
     ├── consumed -> stop
     │
     └── passed -> child-specific behavior
```

Так постепенно складываются:

```text
core navigation
      +
pagination
      +
keyboard
      +
infinite loop
      +
dragging
      +
autoscroll
```

---

# 55. Template Method-like structure

В тех местах, где базовая реализация задаёт общий алгоритм, а subclass переопределяет extension point, возникает Template Method-like structure.

```text
Base algorithm
    │
    ├── invariant step
    ├── extension point
    ├── invariant step
    └── extension point
              │
              ▼
         subclass override
```

Мы не распространяем это название на каждый override подряд - только на реальные алгоритмические extension points.

---

# 56. Static class contracts

Architecture использует static class-level contracts для:

```text
state tables
event-map keys
component-specific defaults
configuration contracts
```

Главное различие:

```text
fixed implementation constant

vs

polymorphic static contract
```

---

# 57. Module constants vs static properties

Module-level constant подходит для внутреннего фиксированного значения.

```text
STATES
KEYBOARD_MODES
mouse button constants
```

Static property/getter уместны, когда значение является именованным class-level contract:

```text
Class.STATES
Class.EVENT_MAP_KEY
Class.DEFAULT_URL
```

Поэтому проект не превращает каждую константу в static property.

---

# 58. `this.constructor` и polymorphic static lookup

Когда static contract должен следовать runtime constructor:

```js
this.constructor.STATES
```

сохраняет subclass polymorphism.

```text
base method
    │
    ▼
this.constructor
    │
    ├── BaseSlider
    └── subclass
          │
          └── possible static override
```

Это особенно уместно в state setters и других extension points.

Но использовать `this.constructor` повсюду только ради возможного будущего наследника не требуется.

---

# 59. Read-only static contracts

Когда static contract должен быть доступен для чтения, но не для замены, используется соответствующий read-only механизм.

Желаемая семантика:

```text
readable
   │
   ├── cannot replace
   └── where needed, cannot mutate contents
```

Механизм вторичен по отношению к контракту.

---

# 60. Shop и default URL

`Shop` является маленьким примером class-level default contract.

Разделяются:

```text
instance URL
     = текущий target

static default URL
     = fallback policy
```

Где нужен runtime-class polymorphism, fallback может разрешаться через actual constructor.

---

# 61. ButtonManager и KeyboardManager return contract

Оба менеджера используют общий result protocol.

```text
action returns
      │
      ├── true
      │     └── handled
      │
      └── null/undefined
             └── preserve original event
```

Это позволяет использовать оба менеджера в одном pipeline без несовместимых протоколов.

---

# 62. Mouse и Button pipeline

Click event может проходить тот же pipeline.

```text
MouseEvent
     │
     ▼
ShowcaseApp
     │
     ▼
Slider.handleClick()
     │
     ▼
AudioPlayer.handleClick()
     │
     ▼
Shop.handleClick()
```

Конкретный handler существует не обязательно у каждого компонента; infrastructure остаётся общей.

---

# 63. Auxiliary mouse input

Application layer нормализует browser semantics:

```text
left
middle
right
```

Это отделяет особенности DOM input от semantic commands компонентов.

---

# 64. Focus и keyboard UI state

После успешного keyboard action application layer может включить временное pressed-state у соответствующего UI element.

```text
keydown
   │
   ▼
semantic command
   │
   ▼
success
   │
   ▼
visual pressed state
   │
   ▼
keyup -> cleanup
```

Так keyboard visual feedback не дублируется внутри каждого доменного компонента.

---

# 65. Autoscroll и UI mode

`autoscrollchange` сообщает не только о timer state.

```text
autoscrollchange
       │
       ▼
ShowcaseApp
   ┌───┴─────────────┐
   ▼                 ▼
audio theme       showcase UI mode
   │                 │
   ▼                 ▼
AudioPlayer      tabindex / classes
```

Slider знает состояние autoscroll. Application layer знает, какие последствия это имеет для продукта в целом.

---

# 66. Audio mode и UI mode

Album playback аналогично вызывает application-level последствия.

```text
albumplay
   │
   ▼
ShowcaseApp
   ├── lock Slider autoscroll
   ├── activate audio layout
   └── update audio tabindex
```

AudioPlayer остаётся сфокусирован на audio domain.

---

# 67. `AudioDeckView`

`AudioDeckView` намеренно маленький.

Он отображает:

```text
track title
track number / total
timeline
current time
duration
```

Он не решает:

```text
which album plays
when track ends
which track is next
what playback mode exists
```

Это AudioPlayer/application concern.

---

# 68. Audio track change

```text
AudioPlayer
      │
      └── audiotrackchange
               │
               ▼
          ShowcaseApp
               │
               ▼
        AudioDeckView
```

View получает достаточно данных для отображения, но не становится владельцем playlist state.

---

# 69. Audio timeline

```text
native timeupdate
          │
          ▼
      AudioPlayer
          │
          └── timechange
                 │
                 ▼
            ShowcaseApp
                 │
                 ▼
          AudioDeckView
```

Таким образом browser-specific media event остаётся внутри audio domain до момента, когда он превращается в application-level event.

---

# 70. Media Session

Player учитывает browser-level media controls.

В результате существует несколько внешних input sources:

```text
keyboard
browser media shortcut
native media event
UI button
```

Все они должны в конечном итоге попасть в semantic commands:

```text
play
pause
next
previous
```

AudioPlayer выступает boundary, который нормализует эти источники.

---

# 71. DOM validation как explicit contract

Каждый major component ожидает определённую DOM structure.

Архитектура рассматривает её как API contract.

```text
Component
    │
    ▼
expected selectors / collections
    │
    ▼
DOMValidator
```

При нарушении required dependency возникает initialization error.

```text
explicit contract
   >
silent recovery
```

---

# 72. Почему fallback selector guessing избегается

Если компонент ожидает конкретный selector, скрытый поиск по нескольким альтернативам может лишь замаскировать неверную структуру markup.

Проект предпочитает:

```text
missing expected DOM
       │
       ▼
fail near initialization
```

Это делает architecture contract видимым.

---

# 73. Resize lifecycle

Slider geometry зависит от текущего viewport/track size.

```text
resize
  │
  ▼
measure current geometry
  │
  ▼
recalculate slide offset
  │
  ▼
move track to current logical position
```

Это влияет не только на visual position, но и на drag threshold и infinite-loop positioning.

---

# 74. Dragging и Autoscroll interaction

Обе функции конкурируют за один track.

```text
autoscroll ON
      │
      ▼
drag starts
      │
      ├── automatic movement suspended
      ├── direct pointer movement enabled
      └── temporary subscriptions
      │
      ▼
drag ends
      │
      ▼
_tryResumeAutoscroll()
```

---

# 75. Audio и Autoscroll - отдельные FSM

Одновременно могут существовать:

```text
Slider state      = IDLE
Autoscroll state  = LOCKED
Audio state       = ALBUM
```

Это не противоречие, потому что эти состояния описывают разные domains.

Именно поэтому единая глобальная FSM была бы неудобной.

---

# 76. Configuration structure

Options разделяет категории:

```text
singleSelectors
groupSelectors
classes
classesActive
jsClasses
states
click
press
autoplay
autoscrollDelay
autoscrollWakeUpDelay
slideTriggerThresholdCoef
```

Тем самым отделяются:

```text
DOM naming
visual classes
runtime states
interaction rules
timing
```

от самих algorithms.

---

# 77. Configuration как contract

Configuration является больше чем bag of options.

Например:

```text
press.next
      │
      ▼
expected handler
      │
      ▼
handler exists?
```

или:

```text
event entry
      │
      ├── target
      └── handler
```

Менеджеры проверяют эти отношения во время initialization.

---

# 78. Micro-framework characteristics

Набор:

```text
EventManager
KeyboardManager
ButtonManager
DOMValidator
Timer
```

уже напоминает маленький внутренний framework.

Но точнее говорить так:

> Приложение выделило повторяющиеся архитектурные механизмы в configurable reusable services.

Ценность здесь не в новом названии, а в повторном использовании механики.

---

# 79. Что намеренно не абстрагировано

Не каждый повторяющийся элемент автоматически превращён в abstraction.

Например:

```text
fixed state table
fixed implementation-specific constant
single-use local calculation
```

не требуют нового manager только потому, что принцип абстракции существует.

Это защищает проект от abstraction for abstraction's sake.

---

# 80. Почему State pattern не навязан

В проекте уже есть явные state tokens, setter validation и transition logic.

Поэтому отдельная State hierarchy была бы оправдана только тогда, когда state-specific behavior существенно разрастётся.

```text
real problem
    v
needs state modeling
    v
local FSM is enough
    v
no extra abstraction
```

---

# 81. Более точная карта паттернов

| Паттерн / принцип | Где | Почему подходит |
|---|---|---|
| Mediator-like | `ShowcaseApp` | централизует cross-component coordination |
| Observer / Pub-Sub-like | custom events + `EventManager` | decouples event producers and consumers |
| Chain of Responsibility | `_stream()` / `_pipe()` | handlers могут поглотить или передать input |
| Strategy-like | `KeyboardManager`, `ButtonManager` | action меняется через configuration |
| Template Method-like | Slider hierarchy | общий алгоритм и polymorphic extension points |
| Command-like | `Button` | UI action представлено как исполняемая команда |
| FSM | Slider / Autoscroll / AudioPlayer | state и transition локализованы у владельца |
| Composition | `ShowcaseApp` | система собрана из независимых частей |
| Dependency Injection | application construction | зависимости передаются снаружи |
| Inversion of Control | composition root | composition отделён от domain logic |
| Polymorphism | slider hierarchy / static contracts | специализация без полной дублирующей реализации |

Точные оговорки:

```text
DI              = архитектурная техника
IoC             = более широкий принцип
FSM             = technique for state modeling
Pub/Sub         = communication style
Observer        = родственный GoF concept, но реализация не textbook Observer
Factory         = термин уместен только при наличии реальной creation abstraction
```

---

# 82. Static inheritance в prototype implementation

В prototype-based implementation явно задаются две формы наследования:

```text
Instance inheritance
Child.prototype
      │
      ▼
Parent.prototype
```

и:

```text
Static inheritance
Child
  │
  ▼
Parent
```

Это позволяет class-level contracts участвовать в inheritance.

Поэтому в осмысленном polymorphic месте:

```text
this.constructor.STATES
```

может сохранять возможность subclass override.

---

# 83. Discipline для aliases

Локальный alias полезен, если он реально улучшает читаемость при повторном использовании.

```text
descriptive long name
       │
       ▼
short alias
       │
       ▼
many local uses
```

Но если static table нужна один раз, прямой доступ может быть яснее:

```js
this.constructor.STATES.IDLE
```

То есть принцип не в том, чтобы никогда не делать alias, а в том, чтобы alias создавался ради ясности, а не автоматически.

---

# 83. Prototype version и Class version

Обе версии представляют одну conceptual architecture.

```text
architecture
     │
     ├── prototype syntax
     │
     └── class syntax
```

Prototype implementation делает более заметными:

```text
prototype chain
constructor restoration
static inheritance
Object.setPrototypeOf(...)
```

Class implementation выражает те же отношения через:

```text
class
extends
static
super
```

Поэтому различие синтаксическое, а не архитектурное.

---

# 84. Маленькая внутренняя экосистема

Во время runtime система выглядит как сеть специализированных объектов:

```text
                    ┌─────────────┐
                    │ ShowcaseApp │
                    └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
    Slider            AudioPlayer             Shop
       │                   │
       │                   │
       ├──────┐       ┌────┴──────┐
       │      │       │           │
       ▼      ▼       ▼           ▼
    events  managers events      managers
       │      │       │           │
       └──────┴───────┴───────────┘
```

Система сложна, но у каждого объекта есть узнаваемая причина существования.

---

# 85. Typical user interaction - Keyboard

Один полный путь:

```text
User presses ArrowRight
        │
        ▼
document keydown
        │
        ▼
EventManager
        │
        ▼
ShowcaseApp._handleKeyDown()
        │
        ▼
KeyboardManager.manage()
        │
        ▼
press mode
        │
        ▼
_stream()
        │
        ▼
_pipe()
        │
        ▼
Slider.handleKeyDown()
        │
        ▼
next()
        │
        ▼
MOVING
        │
        ▼
transition
        │
        ▼
slidechange
        │
        ▼
ShowcaseApp
    ├── Shop
    └── AudioPlayer
```

Здесь видна большая часть архитектуры в одном sequence.

---

# 86. Typical user interaction - Drag

```text
pointerdown
    │
    ▼
ShowcaseApp
    │
    ▼
Slider drag start
    │
    ├── pause automatic motion
    ├── remember initial pointer position
    ├── disable transition behavior
    └── dynamic subscriptions
    │
    ▼
pointermove
    │
    ▼
track follows pointer
    │
    ▼
pointerup
    │
    ▼
calculate distance
    │
    ├── threshold not reached
    │       └── return to current slide
    │
    └── threshold reached
            │
            ▼
       next / previous
            │
            ▼
       normal slider path
```

---

# 87. Typical user interaction - Album playback

```text
User starts album
        │
        ▼
AudioPlayer.play()
        │
        ▼
audio mode/state
        │
        ▼
albumplay
        │
        ▼
ShowcaseApp
   ├── lock autoscroll
   └── activate audio UI
        │
        ▼
native timeupdate
        │
        ▼
AudioPlayer
        │
        ▼
timechange
        │
        ▼
AudioDeckView
```

---

# 88. Main theme / Autoscroll interaction

```text
Autoscroll enabled
       │
       ▼
autoscrollchange
       │
       ▼
ShowcaseApp
       │
       ▼
AudioPlayer.playTheme()
```

При выключении autoscroll приложение может выполнить:

```text
AudioPlayer.resetTheme()
```

Это application policy, а не часть Slider internals.

---

# 89. Data flow

Album data является shared data source, но не global mutable state.

```text
album data
    │
    ├───────────────┐
    ▼               ▼
 Slider         AudioPlayer
    │               │
    │               └── track metadata
    │
    └── active index
             │
             ▼
        ShowcaseApp
         ├── Shop
         └── AudioPlayer
```

Current slide index служит synchronizing identity между визуальным showcase и album data.

---

# 90. Component contracts

Public surface компонента должен быть semantic.

Примеры:

```text
Slider
 ├── next()
 ├── prev()
 ├── goto()
 ├── lockAutoscroll()
 ├── unlockAutoscroll()
 └── ...

AudioPlayer
 ├── play()
 ├── pause()
 ├── toggle()
 ├── playTheme()
 ├── switchAlbum()
 ├── switchAudioTrack()
 └── ...

Shop
 └── setActiveIndex()
```

Application layer предпочитает semantic command прямому mutation internals.

---

# 91. Error boundaries и validation

Проект проверяет разные категории assumptions:

```text
DOM structure
event map structure
handler existence
target element availability
state tokens
index values
configuration values
```

Общий lifecycle:

```text
validate at boundary
      │
      ├── valid -> continue
      └── invalid -> explicit failure
```

---

# 92. Почему архитектура сложнее обычного Slider

Минимальная реализация могла бы использовать:

```text
one object
one event handler
one interval
one audio element
```

Здесь вместо этого:

```text
multiple component boundaries
multiple managers
multiple FSMs
multiple event layers
inheritance
polymorphism
configuration
validation
dynamic subscriptions
```

Это сознательный architectural trade-off.

---

# 93. Architectural trade-off

Больше abstraction означает:

```text
more structure
      │
      ├── better separation
      ├── reuse
      ├── extensibility
      ├── explicit contracts
      └── more code / mental overhead
```

Проект принимает этот cost, потому что architecture является частью учебной цели.

---

# 94. Что делает архитектуру coherent

Система coherent не потому, что в ней много classes.

Она coherent потому, что classes отвечают на разные вопросы:

```text
ShowcaseApp
    -> coordinates

Slider
    -> controls slider behavior

AudioPlayer
    -> controls audio behavior

AudioDeckView
    -> renders audio information

Shop
    -> controls external link state

EventManager
    -> routes subscriptions

KeyboardManager
    -> routes keyboard actions

ButtonManager
    -> routes button actions

Timer
    -> manages timing

DOMValidator
    -> enforces DOM contract

Button
    -> represents executable UI action
```

---

# 95. Архитектурное ядро

Всю систему можно представить одним потоком:

```text
             ┌─────────────────┐
             │   Browser input │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ EventManager    │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ ShowcaseApp     │
             │ coordination    │
             └────────┬────────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │ Managers / pipelines   │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │ Component command       │
          └────────────┬────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
        polymorphism          FSM
              │                 │
              └────────┬────────┘
                       ▼
                 component state
                       │
                       ▼
                 custom event
                       │
                       ▼
                 ShowcaseApp
                       │
                       ▼
          cross-component consequence
```

Эта loop объясняет большую часть архитектуры проекта.

---

# 96. Final summary

Три FSM намеренно локальны:

```text
Slider
  └── IDLE / MOVING

AutoscrollSlider
  └── OFF / ON / LOCKED

AudioPlayer
  └── IDLE / ALBUM / THEME / ALBUMTHEME
```

Main interaction model:

```text
event
  v
routing
  v
pipeline
  v
polymorphic command
  v
state transition
  v
custom event
  v
application coordination
```

И главная архитектурная идея:

```text
Components own behavior.
Managers own reusable mechanisms.
ShowcaseApp owns composition and coordination.
FSMs stay with their owning components.
Patterns are named where the implementation genuinely resembles them.
```

---

# 97. Cross-Cutting Architectural Story

## Почему все части действительно складываются вместе

Архитектуру легче всего запомнить как последовательность решений о владении ответственностью.

```text
1. Появляется browser event.
             │
             ▼
2. Infrastructure его ловит и маршрутизирует.
             │
             ▼
3. ShowcaseApp задаёт application-level order.
             │
             ▼
4. Manager переводит raw input в semantic action.
             │
             ▼
5. Владельческий component выполняет action.
             │
             ▼
6. При необходимости меняется local FSM/state.
             │
             ▼
7. Component публикует meaningful event.
             │
             ▼
8. ShowcaseApp применяет cross-component consequence.
```

Это сквозная линия всего проекта.

## Почему managers - больше, чем удобные wrappers

Менеджер оправдан тогда, когда он выносит механизм, который иначе начал бы повторяться или смешиваться с domain objects. `KeyboardManager`, например, владеет key matching, configuration interpretation и проверкой handler contract. `ButtonManager` делает аналогичное для button/action mappings. `EventManager` владеет subscription lifecycle и discovery event maps. `Timer` владеет interval lifecycle.

```text
Без managers                         С managers
────────────────                    ─────────────
component                            component
  ├─ addEventListener()              └─ domain behavior
  ├─ removeEventListener()                    │
  ├─ key matching                              ▼
  ├─ button lookup                       manager handles
  ├─ handler validation                  reusable mechanism
  └─ domain behavior
```

Результат - не столько меньше строк, сколько более точный язык компонентов.

## Почему `_pipe()` достоин отдельного описания

`_pipe()` - одно из мест, где сразу встречаются composition, polymorphism и explicit return-value protocol.

```text
                    EVENT
                      │
                      ▼
                ┌─────────────┐
                │  component  │
                └──────┬──────┘
                       │
                ┌──────┴───────┐
                ▼              ▼
             handled         passed
                │              │
                ▼              ▼
              true         original event
                │              │
                ▼              ▼
               STOP           NEXT
```

Pipeline поэтому является не просто utility loop, а маленьким protocol of cooperation.

## Почему локальные FSM здесь предпочтительнее

Состояния проекта относятся к разным domains:

```text
Slider FSM        -> movement lifecycle
Autoscroll FSM    -> automatic-motion permission/lifecycle
Audio FSM         -> playback context
```

Если попытаться слить их в одну macro-state model, появится матрица комбинаций вместо более ясной модели.

Local FSM сохраняет ownership близко к коду, который понимает это состояние.

## Почему архитектура не гонится за паттернами

Паттерн полезен здесь, когда он даёт название реальной структуре кода. Он становится вредным, когда код начинают сгибать ради доказательства того, что паттерн применён.

Поэтому используются формулировки:

```text
Template Method-like
Mediator-like
Command-like
Strategy-like
Observer/Pub-Sub-like
```

там, где соответствие частичное или адаптировано к native JavaScript. Архитектура первична; название паттерна - лишь полезный язык для обсуждения.

## Учебная цель

Проект построен вокруг сравнительно простой продуктовой идеи. Slider и audio showcase достаточно малы, чтобы оставаться полностью понятными, но при этом достаточно насыщены, чтобы показать реальные вопросы interaction, state, timing, event propagation, inheritance и cross-component coordination.

Поэтому проект работает как study object: UI даёт архитектуре конкретную задачу, а архитектура превращает UI в лабораторию, где OOP и system-design ideas можно исследовать без фреймворка, который скрывает большую часть механизмов.
---

# 98. Timer: зачем существует `bootstrap`

`Timer` выглядит небольшим utility-классом, но у него есть архитектурно важная деталь - `bootstrap`.

Обычный interval имеет простой жизненный цикл:

```text
start(normalDelay)
      │
      ▼
setInterval()
      │
      ├── tick
      ├── tick
      ├── tick
      └── ...
```

Но автоскроллу иногда нужен временный первый интервал, после которого необходимо вернуться к обычному интервалу.

Например:

```text
временный wake-up
       │
       ▼
первый tick
       │
       ├── выполнить autoscroll action
       │
       └── перезапустить timer с normal delay
```

Именно для этого существует `bootstrap`.

---

# 99. Как реально работает `Timer.bootstrap`

Timer хранит:

```text
_delay
_bootstrap
_onTick
```

а `start(delay)` запускает interval через:

```text
_tick(delay)
```

Ключевой фрагмент:

```js
_tick(delay) {
    this._onTick();

    if (this._bootstrap && delay !== this._delay) {
        this._bootstrap(this._delay);
    }
}
```

Получается такая последовательность:

```text
start(wakeUpDelay)
        │
        ▼
setInterval(..., wakeUpDelay)
        │
        ▼
первый interval tick
        │
        ├── _onTick()
        │      └── выполнить automatic slide action
        │
        └── delay !== canonical _delay
                  │
                  ▼
             bootstrap()
                  │
                  ▼
           start(canonicalDelay)
                  │
                  ▼
              _kill()
                  │
                  ▼
       setInterval(..., canonicalDelay)
```

То есть `bootstrap` - это не отдельный таймер.

Это **одноразовый переход от временного режима планирования обратно к нормальному режиму**.

---

# 100. Почему `bootstrap` находится в `Timer`, а не в `AutoscrollSlider`

Можно было бы реализовать всё непосредственно в Slider:

```text
AutoscrollSlider
    ├── запустить временный timeout
    ├── выполнить action
    └── запустить обычный interval
```

Но тогда domain component пришлось бы знать детали interval bookkeeping.

В текущей архитектуре:

```text
AutoscrollSlider
       │
       │ передаёт Timer:
       │ bootstrapMethod = start
       │ canonicalDelay
       ▼
     Timer
       │
       └── владеет scheduling mechanics
```

Timer не знает, **почему** interval должен измениться.

AutoscrollSlider не занимается низкоуровневым управлением самим interval.

Это хороший небольшой пример separation of concerns:

```text
Timer
    → как переключать scheduling

AutoscrollSlider
    → когда и зачем нужен временный delay
```

---

# 101. `bootstrap` и адаптивный autoscroll

Особенно хорошо это видно вместе с:

```text
AUTOSCROLL_DELAY
AUTOSCROLL_WAKE_UP_DELAY
_getAdaptiveWakeUpDelay()
```

Полный смысл:

```text
slide уже некоторое время виден
        │
        ▼
пользовательская интеракция
        │
        ▼
autoscroll остановлен
        │
        ▼
интеракция закончилась
        │
        ▼
расчёт wake-up delay
        │
        ▼
Timer.start(wakeUpDelay)
        │
        ▼
первый tick
        │
        ├── перейти к следующему слайду
        │
        └── bootstrap normal delay
```

Таким образом Slider решает, **какой временный delay нужен**, а Timer реализует механизм возвращения к canonical interval.

Это важная граница между domain logic и infrastructure.

---

# 102. `albumend` -> Slider -> `slidechange` -> AudioPlayer

Один из наиболее интересных архитектурных сценариев - цикл между AudioPlayer и Slider.

На поверхности его легко представить так:

```text
AudioPlayer -> Slider -> AudioPlayer
```

Но это неточное описание.

Нет прямой циклической зависимости между двумя объектами.

Фактический поток:

```text
          ┌─────────────────────────────┐
          │         AudioPlayer         │
          └──────────────┬──────────────┘
                         │
                    albumend
                         │
                         ▼
                  ┌──────────────┐
                  │ ShowcaseApp  │
                  └──────┬───────┘
                         │
                       next()
                         │
                         ▼
                  ┌──────────────┐
                  │    Slider    │
                  └──────┬───────┘
                         │
                    slidechange
                         │
                         ▼
                  ┌──────────────┐
                  │ ShowcaseApp  │
                  └──────┬───────┘
                         │
                   switchAlbum()
                         │
                         ▼
                  ┌──────────────┐
                  │ AudioPlayer  │
                  └──────────────┘
```

Это **event-mediated feedback loop** - цикл обратной связи, опосредованный событиями и application coordinator.

---

# 103. Почему этот feedback loop не является проблемой

Цикл соответствует реальному правилу приложения:

```text
album закончился
    ↓
перейти к следующему визуальному элементу
    ↓
визуальный элемент определяет следующий album
    ↓
audio context синхронизируется с ним
```

При этом каждый компонент говорит только на языке своего domain:

```text
AudioPlayer:
    "мой album закончился"

ShowcaseApp:
    "после окончания album нужно продвинуть showcase"

Slider:
    "мой active slide изменился"

ShowcaseApp:
    "после смены slide нужно синхронизировать album"
```

Ни AudioPlayer, ни Slider не обязаны знать внутреннюю реализацию друг друга.

Поэтому архитектурно это не:

```text
AudioPlayer ↔ Slider
```

а:

```text
AudioPlayer → event → ShowcaseApp → command → Slider
Slider → event → ShowcaseApp → command → AudioPlayer
```

---

# 104. `albumend` является cancelable event

`albumend` - не просто уведомление.

AudioPlayer создаёт его как:

```js
new CustomEvent("albumend", {
    detail: { ... },
    bubbles: true,
    cancelable: true,
});
```

и затем проверяет:

```js
return e.defaultPrevented;
```

Поэтому событие одновременно является:

```text
notification
+
coordination point
+
optional control signal
```

Логика выглядит так:

```text
album закончился
      │
      ▼
cancelable event
      │
      ▼
ShowcaseApp
      │
      ├── active document
      │      ├── prevent default
      │      └── Slider.next()
      │
      └── inactive document
             └── Slider.nextInstantly()
```

Это уже заметно более выразительный контракт, чем просто "отправить событие".

---

# 105. Active document и background document

Приложение различает активную и неактивную вкладку/document.

Это влияет на реакцию на `albumend`:

```text
albumend
   │
   ▼
document active?
   │
   ├── yes
   │     ├── prevent default
   │     └── Slider.next()
   │
   └── no
         └── Slider.nextInstantly()
```

Причина проста: анимация имеет смысл, когда пользователь действительно смотрит на страницу.

В background нет необходимости искусственно проигрывать визуальную последовательность.

Это хороший пример application policy, которая не принадлежит ни AudioPlayer, ни Slider по отдельности.

---

# 106. Полный synchronization loop

Если собрать несколько механизмов вместе:

```text
                 USER / TIMER
                      │
                      ▼
                    Slider
                      │
                 slidechange
                      │
                      ▼
                ShowcaseApp
                  │       │
                  │       └──────► Shop.setActiveIndex()
                  │
                  └──────────────► AudioPlayer.switchAlbum()
                                           │
                                           ▼
                                    album playback
                                           │
                                      album ended
                                           │
                                           ▼
                                    albumend event
                                           │
                                           ▼
                                    ShowcaseApp
                                           │
                                           ▼
                                      Slider.next()
                                           │
                                      slidechange
                                           │
                                           └──────► ...
```

Это намеренный цикл синхронизации двух представлений одного концептуального объекта:

```text
visual showcase item
        ↕
audio album
```

---

# 107. Почему цикл не становится бесконечной цепочкой

Архитектура содержит важные guard conditions.

Например:

```text
switchAlbum(index)
      │
      ├── invalid → false
      │
      ├── same album → без эффекта смены album
      │
      └── different album
              │
              ▼
          reset track
          try playback
```

И со стороны Slider:

```text
slidechange
      │
      └── появляется только при committed logical slide change
```

Поэтому здесь нет неконтролируемой рекурсии.

Feedback loop есть на уровне **последовательности событий приложения**, но не на уровне прямого вызова методов друг через друга.

---

# 108. Intent и Event не смешиваются

AudioPlayer не говорит:

```text
"переключи Slider на album X"
```

Он сообщает факт:

```text
"album закончился"
```

ShowcaseApp преобразует этот факт в application command:

```text
Slider.next()
```

И наоборот:

```text
Slider:
    "мой active index изменился"

ShowcaseApp:
    "теперь нужно синхронизировать AudioPlayer"
```

Получается важная схема:

```text
event
   ↓
fact
   ↓
application policy
   ↓
semantic command
```

Именно это позволяет компонентам оставаться независимыми.

---

# 109. Pipeline и custom events - разные механизмы

В проекте используются оба механизма, но для разных задач.

### Pipeline

```text
incoming shared input
        │
        ▼
component A
        │
        ▼
component B
        │
        ▼
component C
```

Он отвечает на вопрос:

> Кто ещё должен получить этот input, если предыдущий обработчик его не потребил?

### Custom event

```text
component
    │
    ▼
meaningful event
    │
    ▼
ShowcaseApp
    │
    ▼
application consequence
```

Он отвечает на другой вопрос:

> Что значимое произошло и кому нужно на это отреагировать?

Поэтому:

```text
pipe
    → routing of incoming input

event
    → publication of application/domain fact
```

Это две взаимодополняющие модели.

---

# 110. Одна интеракция может пройти через обе модели

Например:

```text
KeyboardEvent
      │
      ▼
KeyboardManager
      │
      ▼
_pipe()
      │
      ▼
Slider
      │
      ▼
slidechange
      │
      ▼
ShowcaseApp
      │
      ├── Shop
      └── AudioPlayer
```

Сначала работает:

```text
incoming command path
```

а затем:

```text
outgoing domain-event path
```

Это одна из причин, почему архитектуру нельзя свести только к "event-driven" или только к "pipeline-based".

---

# 111. Аналогичный round trip внутри AudioPlayer

Для audio subsystem картина похожа:

```text
keyboard / button
       │
       ▼
KeyboardManager / ButtonManager
       │
       ▼
AudioPlayer
       │
       ▼
track index changes
       │
       ▼
audiotrackchange
       │
       ▼
ShowcaseApp
       │
       ▼
AudioDeckView
```

То есть повторяется общий architectural shape:

```text
input
  ↓
semantic command
  ↓
state change
  ↓
domain event
  ↓
view/application reaction
```

---

# 112. Timer и event architecture встречаются в autoscroll

Autoscroll особенно хорошо показывает, как несколько механизмов собираются в одну систему:

```text
Timer
  │
  ▼
_nextAuto()
  │
  ▼
Slider navigation
  │
  ▼
slidechange
  │
  ▼
ShowcaseApp
  ├── Shop
  └── AudioPlayer
```

При этом Timer не знает ничего о:

```text
slides
albums
Shop
FSM
```

Он только запускает callback в нужный момент.

Это хороший пример того, почему даже маленькая infrastructure class может иметь смысл.

---

# 113. Media Session как ещё одна input boundary

AudioPlayer получает input не только из обычных DOM controls.

```text
              ┌──────────────┐
              │ UI controls  │
              └──────┬───────┘
                     │
              ┌──────▼───────┐
              │ Keyboard     │
              └──────┬───────┘
                     │
              ┌──────▼───────┐
              │ Media Session│
              └──────┬───────┘
                     │
                     ▼
                AudioPlayer
                     │
                     ▼
              semantic commands
```

Все эти внешние способы управления в итоге сходятся в semantic API AudioPlayer.

То есть компонент служит boundary между:

```text
разными источниками input
```

и:

```text
единым доменным API playback
```

---

# 114. Почему `preventDefault()` - не вся input architecture

Обычная обработка `keydown` и browser media controls могут идти разными путями.

Поэтому архитектура рассматривает:

```text
обычный keyboard input
```

и:

```text
Media Session input
```

как разные внешние каналы, которые сходятся внутри AudioPlayer.

Так browser-specific details остаются внутри audio boundary, а остальная система работает с:

```text
play
pause
next
previous
toggle
```

---

# 115. State ownership в feedback loop

В цикле Slider ↔ AudioPlayer участвуют разные владельцы состояния:

```text
Slider
  └── active visual index

AudioPlayer
  └── album / track / playback mode

ShowcaseApp
  └── application coordination state
```

Нет единого:

```text
global currentItem
```

который все компоненты должны мутировать.

Вместо этого используются:

```text
local truth
+
events
+
coordination
```

Так система остаётся синхронизированной без передачи ownership одному глобальному объекту.

---

# 116. Система event-driven, но не "глобально event-based"

Не каждый метод отправляет событие.

Не каждый вызов идёт через EventManager.

Механизмы выбираются по смыслу:

```text
обычный method call
    → когда отношение между объектами уже принадлежит вызывающему

custom event
    → когда meaningful fact должен пересечь component boundary

pipeline
    → когда shared input должен пройти через несколько handlers
```

Это более точное описание архитектуры, чем просто:

```text
"приложение использует events"
```

---

# 117. Ownership различных lifecycle

Разные механизмы жизненного цикла намеренно принадлежат разным объектам:

```text
DOM subscription lifecycle
    → EventManager

keyboard action lifecycle
    → KeyboardManager

button action lifecycle
    → ButtonManager / Button

timer lifecycle
    → Timer

drag lifecycle
    → DraggableSlider

autoscroll lifecycle
    → AutoscrollSlider

audio lifecycle
    → AudioPlayer

cross-component lifecycle
    → ShowcaseApp
```

Это хорошо объясняет наличие нескольких небольших объектов вместо одного giant controller.

---

# 118. Почему маленькие объекты всё-таки образуют единую архитектуру

Некоторые abstractions сами по себе очень маленькие:

```text
Timer
Button
Shop
DOMValidator
```

Их ценность становится видна на уровне composition:

```text
           ┌───────────────┐
           │ Application   │
           └───────┬───────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    domain      managers    validation
       │           │           │
       └───────────┼───────────┘
                   ▼
                 DOM
```

Каждый объект снимает одну категорию ответственности с другого объекта.

Именно это, а не количество строк, является причиной его существования.

---

# 119. Эволюция архитектуры через реальные проблемы

Архитектура не была построена исключительно как теоретическая схема.

Проект развивался через реализацию, тестирование и debugging.

Это важно, потому что часть архитектурных решений появилась потому, что конкретное поведение обнаружило реальную проблему.

Например:

```text
movement track
      ≠
committed slide change
```

стало существенным, когда небольшое движение каретки могло запускать неправильную downstream-обработку.

Аналогично:

```text
automatic movement
      ≠
manual movement
```

важно для корректного restart/pause поведения autoscroll.

Поэтому архитектура отражает не только заранее выбранные patterns, но и проблемы, обнаруженные во время реализации.

---

# 120. Prototype/Class parity как отдельный архитектурный эксперимент

Вторая реализация - не просто механическая смена синтаксиса.

Она позволяет отдельно исследовать, что в архитектуре относится к:

```text
prototype inheritance
```

а что относится к:

```text
ES6 class syntax
```

Цель parity:

```text
same responsibilities
same contracts
same FSM model
same event flow
same manager responsibilities
same component boundaries
```

при различающемся синтаксисе.

Поэтому архитектура в документации важнее конкретного способа записи inheritance.

---

# 121. Полная end-to-end картина

Всю систему можно представить одним большим, но понятным циклом:

```text
                     ┌──────────────────┐
                     │    Browser DOM   │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  EventManager    │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   ShowcaseApp    │
                     │ routing / policy │
                     └────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
             input pipeline        component command
                    │                   │
                    ▼                   ▼
                 Slider            AudioPlayer
                    │                   │
                    │                   │
              slidechange          album/track event
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       ShowcaseApp
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
                Slider     AudioPlayer   Shop
                  │
                  ▼
              Timer / FSM
```

И характерная feedback loop:

```text
AudioPlayer
    │
 albumend
    ▼
ShowcaseApp
    │
 next()
    ▼
Slider
    │
slidechange
    ▼
ShowcaseApp
    │
switchAlbum()
    ▼
AudioPlayer
```

Это не случайная circular dependency.

Это координированный feedback loop, в котором:

```text
events carry facts
ShowcaseApp carries policy
components carry domain state
commands carry intent
```

---

# 122. Заключительная перспектива Deep Dive

Наиболее полезно оценивать эту архитектуру не по количеству классов или названий паттернов.

Нужно смотреть на другое:

```text
кто владеет решением?
кто выполняет механизм?
кто публикует факт?
кто координирует последствия?
```

И тогда основная схема становится очень простой:

```text
input
  ↓
routing
  ↓
pipeline
  ↓
semantic command
  ↓
component algorithm
  ↓
local state
  ↓
domain event
  ↓
application coordination
  ↓
another semantic command
```

Главная идея проекта поэтому шире, чем просто "много архитектурных abstractions":

> Архитектура - это не коллекция абстракций. Это набор границ, который определяет, кто владеет решением, кто выполняет механизм, кто объявляет факт и кто отвечает за координацию его последствий.

И именно эта идея проходит через всю реализацию.
