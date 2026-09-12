# Interactive Showcase

The application combines an **infinite album slider**, **drag/touch interaction**, **keyboard control**, **automatic scrolling**, an integrated **audio player**, synchronized **album/shop data**, and a small set of reusable infrastructure services.

> **Architecture note:** the project exists in two JavaScript implementation variants. The public architecture is intentionally the same, so this documentation describes the shared design rather than a particular JavaScript syntax.

---

## What the application does

```mermaid
flowchart LR
    U[User] --> S[Album Showcase]
    S --> SL[Infinite Slider]
    S --> AP[Audio Player]
    S --> SHOP[BUY ALBUM link]
    S --> VIEW[Audio Deck View]

    SL -->|slidechange| APP[ShowcaseApp]
    AP -->|album / track events| APP
    APP --> SHOP
    APP --> AP
    APP --> SL
    APP --> VIEW
```

The showcase contains five configured album entries and their playlists.
The same album index is used to keep the visual showcase, audio playlist and purchase link synchronized.

---

## Main architecture

```mermaid
flowchart TB
    APP[ShowcaseApp]

    SLIDER[AutoscrollSlider]
    AUDIO[AudioPlayer]
    VIEW[AudioDeckView]
    SHOP[Shop]

    APP --> SLIDER
    APP --> AUDIO
    APP --> VIEW
    APP --> SHOP

    subgraph Slider hierarchy
        B[BaseSlider]
        P[PaginationSlider]
        K[KeyboardSlider]
        I[InfiniteSlider]
        D[DraggableSlider]
        A[AutoscrollSlider]
        B --> P --> K --> I --> D --> A
    end

    subgraph Reusable infrastructure
        EM[EventManager]
        KM[KeyboardManager]
        BM[ButtonManager]
        DV[DOMValidator]
        T[Timer]
        BTN[Button]
    end

    SLIDER --> EM
    SLIDER --> KM
    SLIDER --> BM
    SLIDER --> DV
    SLIDER --> T
    SLIDER --> BTN
    AUDIO --> EM
    AUDIO --> KM
    AUDIO --> BM
    AUDIO --> DV
    AUDIO --> BTN
    SHOP --> KM
    SHOP --> DV
    VIEW --> DV
    APP --> EM
    APP --> KM
    APP --> DV
```

---

## Slider capabilities are layered by inheritance

```text
BaseSlider
   │  core movement, state, index, resize
   ▼
PaginationSlider
   │  generated pagination
   ▼
KeyboardSlider
   │  keyboard routing
   ▼
InfiniteSlider
   │  clones + teleportation + logical index normalization
   ▼
DraggableSlider
   │  mouse/touch drag lifecycle
   ▼
AutoscrollSlider
      timer + pause/resume + lock + visibility/focus handling
```

Each layer adds one major capability while preserving the parent contract.

---

## Three local FSMs

### 1. Slider movement FSM

```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> MOVING: next / prev / goto
    MOVING --> IDLE: transitionend
    IDLE --> IDLE: ignored input / same index
```

`MOVING` blocks conflicting input until the transition finishes.

### 2. Autoscroll FSM

```mermaid
stateDiagram-v2
    [*] --> OFF
    OFF --> ON: enable / toggle
    ON --> OFF: disable / toggle
    ON --> LOCKED: lockAutoscroll
    LOCKED --> ON: unlockAutoscroll

    ON --> ON: timer / resume
    ON --> ON: pause condition changes
```

The timer itself is not the state. It is the mechanism that advances the slider while the autoscroll state permits it.

### 3. Audio playback FSM

```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> THEME: playTheme
    IDLE --> ALBUM: playAlbum
    THEME --> IDLE: pause / reset
    THEME --> ALBUMTHEME: start album
    ALBUM --> IDLE: pause
    ALBUM --> THEME: pause + restore theme
    ALBUMTHEME --> THEME: album pause
```

`ALBUMTHEME` represents the application-level transition in which album playback is requested while the main theme is the current audio context.

---

## Input pipeline

The application routes keyboard and pointer input through components instead of hard-coding every interaction in one handler.

```mermaid
flowchart LR
    E[Browser event] --> APP[ShowcaseApp]
    APP --> KM[KeyboardManager]
    KM --> MODE{Routing mode}
    MODE -->|normal| S[Slider → AudioPlayer → Shop]
    MODE -->|reverse / passthrough| A[AudioPlayer → Slider → Shop]
    S --> R[return value]
    A --> R
    R --> STOP{handled?}
    STOP -->|yes| END[consume]
    STOP -->|pass-through| NEXT[continue pipeline]
```

The same idea is used for clicks through `Button` and `ButtonManager`.

---

## Event-driven coordination

Components expose domain-level DOM events such as:

```text
slidemove
slidechange
autoscrollchange
albumplay
albumpause
albumplaypassthrough
albumend
audiotrackchange
timechange
viewportclick
```

The event flow is intentionally one-directional at the application boundary:

```mermaid
flowchart LR
    SL[Slider] -->|slidechange| APP[ShowcaseApp]
    APP -->|switchAlbum| AP[AudioPlayer]
    APP -->|setActiveIndex| SH[Shop]

    AP -->|audiotrackchange| APP
    AP -->|timechange| APP
    APP -->|render| VIEW[AudioDeckView]

    AP -->|albumplay| APP
    APP -->|lockAutoscroll| SL
```

---

## Reusable infrastructure

| Service           | Responsibility                                                                 |
| ----------------- | ------------------------------------------------------------------------------ |
| `EventManager`    | declarative event maps, prototype-chain event discovery, dynamic subscriptions |
| `KeyboardManager` | configuration → key matching → component handler dispatch                      |
| `ButtonManager`   | configuration → button matching → component handler dispatch                   |
| `DOMValidator`    | fail-fast validation of required DOM nodes and collections                     |
| `Timer`           | controlled interval lifecycle with an optional bootstrap/restart callback      |
| `Button`          | small command adapter for DOM buttons                                          |

These services keep infrastructure concerns out of the slider and audio domain logic.

---

## Key interaction flows

**Manual navigation**

```text
keyboard / click
      ↓
ShowcaseApp
      ↓
Slider.next() / prev() / goto()
      ↓
MOVING
      ↓
transitionend
      ↓
slidechange
      ↓
Shop + AudioPlayer synchronization
```

**Autoscroll**

```text
Timer tick
    ↓
AutoscrollSlider._nextAuto()
    ↓
Slider movement
    ↓
slidechange
    ↓
album synchronization
```

**Album playback**

```text
AudioPlayer.playAlbum()
       ↓
albumplay
       ↓
ShowcaseApp
   ├── lock slider autoscroll
   └── activate audio layout
```

**Drag**

```text
pointer down
    ↓
pause autoscroll
    ↓
subscribe temporary document handlers
    ↓
move track
    ↓
pointer up / cancel
    ↓
threshold decision
    ↓
next / prev / restore position
    ↓
unsubscribe temporary handlers
    ↓
resume when allowed
```

---

## Data-driven configuration

Component behaviour is configured through objects passed to constructors. The configuration contains selectors, CSS classes, command names, key maps, timing values and application data.

A representative keyboard contract is:

```js
press: {
    next: ["ArrowRight", "KeyD"],
    prev: ["ArrowLeft", "KeyA"]
}
```

`KeyboardManager` derives the expected method name (`_pressNext`, `_pressPrev`) and validates that the component actually provides it.

This gives the configuration a real runtime contract instead of treating it as passive constants.

---

## Infinite loop model

The visual slider contains two cloned boundary slides:

```text
[last clone] [1] [2] [3] ... [N] [first clone]
     ↑                         ↑
   teleport                  teleport
```

The internal index may temporarily point at a clone. `InfiniteSlider` maps those positions back to the corresponding real slide and keeps the public/logical index normalized.

---

## Accessibility and interaction details

The implementation also handles several interaction details rather than relying only on the happy path:

- pagination buttons receive `aria-label` and `aria-current`;
- focus is cleared when switching interaction modes;
- keyboard button feedback is represented by a temporary CSS state;
- autoplay can pause on hover/focus;
- document visibility affects autoplay behaviour;
- touch multi-contact is rejected for the drag operation;
- middle/right-button edge cases are explicitly handled;
- browser media shortcuts are accounted for by the audio player;
- resize temporarily suspends normal slider interaction and restores it afterward.

---

## Project structure

```text
on-.../
├── assets/
│   ├── audio/
│   └── images/
├── script/
│   ├── components/
│   ├── core/
│   ├── services/
│   ├── utils/
│   ├── main.js
│   └── showcase-app.js
├── styles/
│   ├── reset.css
│   └── main.css
├── index.html
└── README.md
```

---

## Design vocabulary

The project deliberately uses a few established ideas where they fit the implementation:

- **Prototype inheritance / polymorphism** — the slider grows by specialized prototypes and override hooks.
- **Command dispatch** — keyboard and button configuration resolve input to component commands.
- **Observer-like event publication** — components publish custom DOM events without calling application methods directly.
- **Application coordinator** — `ShowcaseApp` coordinates component interactions while domain mechanics stay inside their components.
- **Fail-fast validation** — invalid DOM/configuration contracts stop initialization rather than being hidden by silent fallbacks.

These are descriptions of the actual implementation, not an attempt to force every part into a formal GoF pattern.
