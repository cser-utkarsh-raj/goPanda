# 🐼 goPanda

> **A lightweight desktop focus companion with a full workspace and an optional circular panda widget.**

goPanda is a local-first productivity app for focused study and work. The **full desktop app is the primary experience**: timer, tasks, notes, settings, and progress live in one workspace. The **floating panda is optional** and can be popped out when you want the timer visible while working in another application.

## ✨ What it does

- ⏱️ Pomodoro, countdown, and stopwatch workflows.
- 🎯 Per-task time targets with live elapsed/remaining progress.
- 📝 Sticky notes and checklists stored locally.
- 🐼 Optional borderless circular panda widget.
- 🖥️ Tauri 2 desktop application for Windows, macOS, and Linux.
- 🌐 Vite/React web build for the public landing page and browser use.
- 🔒 No backend is required for the core productivity data; state is persisted in browser local storage.

## 🧠 How goPanda works

The application has two presentation layers around the same React state.

```text
                    ┌─────────────────────────────┐
                    │        goPanda React        │
                    │                             │
                    │ Timer + Tasks + Notes       │
                    │ Settings + Progress         │
                    └──────────────┬──────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
               Full workspace              Widget view
                     │                           │
              normal Tauri window       transparent overlay
                     │                           │
              1240 × 840 default        circular panda
                     │                           │
                     └─────────────┬─────────────┘
                                   │
                           Desktop bridge
                                   │
                             Tauri 2 commands
```

### 1. Timer state

The timer lives in `App.tsx` and tracks:

- current timer mode
- Pomodoro phase
- remaining/elapsed seconds
- whether the timer is running
- Pomodoro count
- active study task

The timer loop uses elapsed wall-clock time rather than assuming that a one-second interval is perfectly accurate:

```text
start
  ↓
record current timestamp
  ↓
every tick → calculate Date.now() - previous timestamp
  ↓
advance timer / stopwatch
  ↓
update active task elapsed time
  ↓
when a phase reaches zero → switch phase
```

This keeps the timer from drifting as badly when the browser/webview is delayed.

### 2. Tasks and notes

Tasks and notes are React state owned by the app.

```text
User action
   ↓
React state
   ↓
localStorage
   ↓
restored when goPanda starts again
```

Task progress is updated while a focus/stopwatch session is running. When a task reaches its target, goPanda marks it complete and can play the configured celebration sound.

### 3. Full app vs widget

The **full app is the default desktop view**.

The widget is an explicit view mode:

```text
Full workspace
     │
     │ Pop Out Circle Widget
     ▼
┌───────────────┐
│      🐼       │
│   progress    │
└───────────────┘
     │
     ├─ click → play / pause
     ├─ hover → reveal timer status
     └─ double-click → return to full workspace
```

Tauri changes the native window properties for widget mode:

- transparent
- borderless
- non-resizable
- always-on-top
- removed from the taskbar
- positioned near the bottom-right of the primary display

Returning to full mode restores the normal decorated, resizable application window.

### 4. Desktop bridge

`src/services/desktopBridge.ts` is the boundary between React and native desktop behavior.

React asks for high-level actions such as:

- switch to widget/full mode
- toggle fullscreen
- minimize
- close
- listen for native mode changes

The Tauri implementation lives in `src-tauri/src/lib.rs`. This keeps native window manipulation out of the UI components.

### 5. Website vs desktop app

The public Vercel build is a **landing/download site**. It does not force the desktop UI open.

```text
Web visitor
   ↓
Landing page
   ├── Features
   ├── Product preview
   └── Download links

Native Tauri launch
   ↓
Full goPanda workspace
   ├── Timer
   ├── Tasks
   ├── Notes
   └── Optional panda widget
```

This distinction is intentional: the website explains/downloads the product; the installed desktop application is the product workspace.

## 📂 Project structure

```text
goPanda/
├── .github/
│   └── workflows/
│       ├── build-exe.yml          # Tauri desktop builds/releases
│       └── deploy.yml             # web deployment workflow
├── public/                        # static web/PWA assets
├── src/
│   ├── app/
│   │   └── App.tsx                # application state + composition
│   ├── components/
│   │   ├── branding/              # panda + .dot visual identity
│   │   ├── landing/               # public website/download UI
│   │   ├── notes/                 # sticky notes feature
│   │   ├── settings/              # settings UI
│   │   ├── tasks/                 # study goals/subtasks
│   │   ├── timer/                 # timer UI
│   │   └── widget/                # circular floating panda
│   ├── services/
│   │   └── desktopBridge.ts       # React ↔ Tauri boundary
│   ├── utils/
│   │   ├── audio.ts               # sounds
│   │   └── time.ts                # time formatting/parsing
│   ├── types/
│   │   └── index.ts               # shared domain types
│   ├── index.css                  # global styling
│   └── main.tsx                   # React entry point
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                 # native commands/window behavior
│   │   └── main.rs                # Tauri entry point
│   ├── icons/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── vite.config.ts
├── vercel.json
├── package.json
└── README.md
```

### Why the structure is split this way

```text
app/          → orchestration and shared application state
components/   → UI grouped by product feature
services/     → external/native integrations
utils/        → reusable pure-ish helpers
types/        → shared domain contracts
src-tauri/    → native desktop implementation
public/       → browser-facing static assets
```

The goal is that a developer looking for a feature can find it without searching a 40k-line application folder.

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Motion |
| Icons | Lucide React |
| Desktop | Tauri 2 |
| Persistence | Browser localStorage |
| Web deployment | Vercel |
| Desktop CI | GitHub Actions |

## 🚀 Development

```bash
git clone https://github.com/cser-utkarsh-raj/goPanda.git
cd goPanda
npm install

# Browser development
npm run dev

# Type-check
npm run lint

# Production web build
npm run build

# Preview production build
npm run preview

# Build the native desktop application
npm run tauri:build
```

The Vite development server runs on port `3000`.

## 🏗️ Desktop build pipeline

```text
Push to main
    ↓
GitHub Actions
    ↓
Node + npm
    ↓
Vite production build
    ↓
Tauri 2 / Rust
    ↓
Native installers
    ├── Windows
    ├── macOS
    └── Linux
```

The desktop workflow intentionally uses the repository's npm setup and does not depend on Bun.

## 🌐 Web deployment

The repository contains `vercel.json` so Vercel can build the Vite site with:

```text
npm install
    ↓
npm run build
    ↓
dist/
```

The public web experience is the landing/download site.

## 🔊 Local-first data

Core user state is stored locally:

- `pomo_panda_settings`
- `pomo_panda_subtasks`
- `pomo_panda_notes`

There is no server-side database in the core application.

## 🤝 Contributing

Keep new functionality close to its feature folder. Avoid putting feature-specific logic into `App.tsx` unless it genuinely coordinates multiple features.

If a new native capability is required, expose it through `src/services/desktopBridge.ts` and implement the platform-specific behavior in `src-tauri/src/lib.rs`.

## License

goPanda is open source software licensed under the [MIT License](LICENSE).

> **goPanda · Focus, one block at a time.**
>
> **Presented by .dot**
