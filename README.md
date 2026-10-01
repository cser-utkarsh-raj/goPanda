# 🐼 goPanda

> **A tiny desktop focus companion that lives beside your work.**

`goPanda` is a small productivity app built around one job: **help you start focused work without turning productivity into another complicated system.**

It belongs to the lightweight/public-tool side of the **.dot** ecosystem.

## 🔄 Focus Loop

```mermaid
stateDiagram-v2
    [*] --> Ready
    Ready --> Focus: start
    Focus --> Break: focus block ends
    Break --> Focus: break ends
    Focus --> Complete: stop
    Break --> Complete: stop
    Complete --> Ready: new session
    Complete --> [*]
```

**How to read it:** goPanda intentionally has a tiny state machine. A session is either ready, focused, on a break, or complete; the product stays out of the user's way.

## What It Does

- ⏱️ **Pomodoro-focused workflow** for timed work and breaks.
- 🐼 **Floating panda companion** with a circular timer progress meter.
- 🖱️ **Hover to expand** the panda and reveal the live remaining time.
- 🖱️🖱️ **Double-click the panda** to open the full goPanda workspace.
- 🖥️ **Transparent always-on-top desktop widget** powered by Tauri.
- ⚡ **Local-first interaction** with the timer, tasks and notes kept on the device.

The product is intentionally smaller than .dot's flagship platforms. **goPanda is a tool, not a platform.**

## 🧭 Design Philosophy

```text
Choose a focus block
        ↓
      Work
        ↓
     Break
        ↓
   Repeat / Stop
```

No complicated productivity methodology is required. The goal is to provide a pleasant focus loop that gets out of the way.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Motion | Motion |
| Icons | Lucide React |
| Desktop | Tauri 2 |
| Runtime | Browser + Tauri 2 desktop |

## 🚀 Run Locally

```bash
git clone https://github.com/cser-utkarsh-raj/goPanda.git
cd goPanda
npm install
npm run dev
```

The Vite development server uses port `3000`.

```bash
npm run build
npm run preview
npm run tauri:build
npm run lint
```

## 📂 Project Direction

goPanda is designed to remain **small, fast, friendly, and easy to iterate on**. It can grow with useful productivity features, but it should not become a bloated task-management suite.

That constraint is part of the product identity.

## 🌐 Part of .dot

`.dot` is the umbrella behind a collection of products and experiments — from flagship platforms such as Sailor and myMentor to infrastructure such as dotRoute and lightweight public tools such as goPanda and NailedIt.

> **goPanda · Focus, one block at a time.**
>
> **Presented by .dot**


## 🐼 Desktop Widget

When running as a desktop app, goPanda starts as a small floating panda instead of a mini dashboard.

- **Idle:** panda logo + circular session progress
- **Hover:** panda smoothly grows and reveals the remaining time
- **Single click:** start / pause
- **Double click:** open the full goPanda workspace
- The widget stays above other windows while the full workspace is opened only when requested.

## License

goPanda is open source software licensed under the [MIT License](LICENSE).
