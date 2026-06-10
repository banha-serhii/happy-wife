import type { ReactNode } from "react";

interface ScreenContainerProps {
  children: ReactNode;
}

export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.95),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(212,212,216,0.5),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top,_rgba(39,39,42,0.95),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(63,63,70,0.45),_transparent_32%)]" />

      <section className="relative flex min-h-dvh items-stretch px-2 py-2 sm:px-3 sm:py-3">
        <div className="relative flex w-full min-w-0 flex-col">
          {children}
        </div>
      </section>
    </main>
  );
}
