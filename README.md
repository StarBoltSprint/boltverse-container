# Boltverse Official Container

Desktop-first web shell for the **Boltverse Games Section** (digital Thunderwolf Citadel).

Built for a public deployable link via **Grok Build App Deployer** (`*.grok.me`) or any static host.

## What’s in v0.1

- **Platform chooser first**: Desktop / Android / iOS (saved in `localStorage`)
- **Desktop shell**: side nav + wide Home layout
- **Android / iOS shell**: phone frame + bottom tabs + compact chrome
- **Switch layout** anytime from the top bar
- **Home**: Core hero, quick actions, featured, continue, dailies, event banner
- **Discover / Create / Pack / Codex**: scaffold + mock data
- **Hash routing** + **`base: "./"`** for `*.grok.me` / static hosts

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for deploy (*.grok.me)

```bash
npm run build
```

Upload the **`dist/`** folder (or point Grok Build / App Deployer at this project and publish).

Preview production build:

```bash
npm run preview
```

## Stack

- Vite 6
- React 19
- React Router 7 (HashRouter)
- TypeScript
- Custom cosmic CSS (no Tailwind dependency)

## Next steps

1. Play session + Results screens for one Mini-Quest and one Story Branch
2. Wire Create → mock publish into Discover
3. Optional guest profile
4. Shared API hooks for real Star Core / Resonance

**Powered by xAI & YOU · AROOO ⚡🐺**
