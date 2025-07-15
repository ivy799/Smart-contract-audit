import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
export function AnimatedGridPatternDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 absolute inset-0 pointer-events-none">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.4}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[80%] skew-y-12",
        )}
      />
    </div>
  );
}
