# videcoding-smaple-nextjs

A modern Next.js application with TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library built with Radix UI
- **ESLint** - Code linting and formatting

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ahwei/videcoding-smaple-nextjs.git
cd videcoding-smaple-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles with Tailwind
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
│   └── utils.ts        # Helper utilities (cn function)
├── public/             # Static assets
└── components.json     # shadcn/ui configuration
```

## Adding shadcn/ui Components

The project is configured with shadcn/ui. To add new components:

1. Browse available components at [ui.shadcn.com](https://ui.shadcn.com)
2. Add components manually by creating files in `components/ui/`
3. Import and use them in your pages

Example:
```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Click me</Button>;
}
```

## Customization

### Tailwind CSS

- Main configuration: `postcss.config.mjs`
- Global styles and theme: `app/globals.css`
- Custom colors and design tokens are configured in CSS variables

### TypeScript

- Configuration: `tsconfig.json`
- Path aliases configured with `@/*` pointing to root directory

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
