import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "relative flex w-full max-w-none min-h-[calc(100dvh-1rem)] flex-col",
        "rounded-2xl border border-zinc-200/80 bg-white/85 p-5 text-center shadow-xl shadow-zinc-300/40 backdrop-blur-xl",
        "sm:min-h-[calc(100dvh-2rem)] sm:rounded-[2rem] sm:p-6 sm:shadow-2xl",
        "md:p-8",
        "dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:shadow-black/50",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
