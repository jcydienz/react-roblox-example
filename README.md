# React Roblox Example

A simple example project demonstrating how to build React-powered UI in Roblox using [roblox-ts](https://roblox-ts.com/).

This is a **Notepad UI** built entirely with `@rbxts/react` and `@rbxts/react-roblox`

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rojo](https://rojo.space/) for syncing to Roblox Studio
- [roblox-ts](https://roblox-ts.com/) (`npm install -g roblox-ts`)

## Project Structure

```
src/
  client/
    main.client.tsx      — Entry point, mounts the React tree to PlayerGui
    components/
      Notepad.tsx         — The Notepad UI component
```

## Tech Stack

- [roblox-ts](https://roblox-ts.com/) — TypeScript to Luau compiler
- [@rbxts/react](https://www.npmjs.com/package/@rbxts/react) — React bindings for Roblox
- [@rbxts/react-roblox](https://www.npmjs.com/package/@rbxts/react-roblox) — React renderer for Roblox instances
- [Lucide Icons](https://lucide.dev/) — Icon set used via Roblox image assets
