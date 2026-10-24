import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_0_24px_rgba(6,182,212,0.35)]">
        <svg viewBox="0 0 24 24" className="size-5 text-white" aria-hidden="true">
          <rect
            x="7"
            y="3"
            width="10"
            height="18"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M9.5 14.5 11 16l3.5-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-white">DicoFix</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
            Smartphone Repair
          </span>
        </span>
      ) : null}
    </span>
  );
}
