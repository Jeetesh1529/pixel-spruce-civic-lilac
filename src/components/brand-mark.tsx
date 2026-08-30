import { cn } from "@/lib/cn";

export function BrandMark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={light ? "/assets/logo-60-sm.png" : "/assets/logo-hex.png"}
        alt="60 years since 1966"
        className={cn(light ? "h-9 w-auto sm:h-11" : "h-10 w-auto sm:h-12")}
      />
    </div>
  );
}

export function SixtyBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid size-16 place-items-center border-2 border-brand bg-ink text-center sm:size-[4.5rem]",
        className,
      )}
    >
      <div>
        <p className="font-display text-3xl leading-none text-brand">60</p>
        <p className="text-[0.55rem] font-semibold tracking-[0.18em] text-paper uppercase">Years</p>
      </div>
    </div>
  );
}
