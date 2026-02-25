# Technology Stack

## Core Technologies

- **Framework**: React 19.2.3 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS with custom breakpoint (`xl: 1500px` for desktop mode)

## Project Configuration

- **Module System**: ES Modules (`"type": "module"`)
- **TypeScript**: Bundler module resolution, React JSX transform, path aliases via `@/*`
- **Vite**: Custom alias resolution, dev server on port 3000
- **Tailwind CSS**: Custom breakpoint configuration with `xl:` at 1500px for desktop mode

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## State Management

- Local React state with `useState` hooks
- LocalStorage persistence for custom tags and user presets
- No external state management library (Redux, Zustand, etc.)
