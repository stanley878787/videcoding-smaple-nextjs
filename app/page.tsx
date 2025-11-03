import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Next.js + Tailwind CSS + shadcn/ui
          </h1>
          <p className="text-muted-foreground text-lg">
            A modern web application starter with TypeScript, Tailwind CSS v4, and shadcn/ui components.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Edit <code className="bg-muted px-2 py-1 rounded">app/page.tsx</code> to get started</p>
        </div>
      </main>
    </div>
  );
}
