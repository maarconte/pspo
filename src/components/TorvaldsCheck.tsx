import { Button } from "@/components/ui/button";
import { useCounterStore } from "../stores/useCounterStore";

export default function TorvaldsCheck() {
  // Utilisation de sélecteurs pour éviter les re-renders inutiles
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const reset = useCounterStore((s) => s.reset);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">TorvaldsCheck Component</h1>

      <div className="flex items-center gap-4">
        <p className="text-6xl font-bold text-primary">{count}</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={increment} size="lg">
          Increment
        </Button>
        <Button onClick={reset} variant="outline" size="lg">
          Reset
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>✅ Zustand store with atomic selectors</p>
        <p>✅ Shadcn UI Button component</p>
        <p>✅ Tailwind CSS for styling</p>
        <p>✅ TypeScript strict typing</p>
        <p>✅ React 19 functional component (no forwardRef needed)</p>
      </div>
    </div>
  );
}
