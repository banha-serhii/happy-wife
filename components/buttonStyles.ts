const buttonShape =
  "h-12 min-w-0 rounded-2xl px-4 text-sm font-semibold tracking-wide sm:h-auto sm:min-w-[7.5rem] sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base";

export const yesButtonBase = [
  "touch-none w-full",
  buttonShape,
  "shadow-md transition-[transform,box-shadow,background-color,border-color,width] duration-300",
  "active:scale-[0.97]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
].join(" ");

export const yesButtonEvading = [
  "border border-rose-200/80 bg-gradient-to-b from-white to-rose-50/80 text-rose-700",
  "shadow-rose-200/40 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/50",
  "focus-visible:ring-rose-300",
  "dark:border-rose-900/60 dark:from-zinc-900 dark:to-rose-950/40 dark:text-rose-300",
  "dark:hover:border-rose-800 dark:hover:shadow-rose-950/50",
].join(" ");

export const yesButtonCatchable = [
  "border border-rose-400/50 bg-gradient-to-b from-rose-500 to-rose-600 text-white",
  "shadow-lg shadow-rose-500/35 animate-pulse",
  "hover:scale-105 hover:from-rose-400 hover:to-rose-500 hover:shadow-xl hover:shadow-rose-500/40",
  "focus-visible:ring-rose-400",
  "dark:from-rose-600 dark:to-rose-700 dark:shadow-rose-900/50",
].join(" ");

export const noButtonBase = [
  "w-full",
  buttonShape,
  "border border-emerald-400/30 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white",
  "shadow-lg shadow-emerald-500/30 transition-[transform,box-shadow,background-color] duration-300",
  "hover:scale-105 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-xl hover:shadow-emerald-500/40",
  "active:scale-[0.97]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
  "dark:from-emerald-600 dark:to-emerald-700 dark:shadow-emerald-900/40",
].join(" ");

export const noButtonEmphasized = [
  "text-xs leading-tight sm:text-base sm:leading-normal",
  "ring-2 ring-emerald-300/60 animate-pulse",
  "shadow-xl shadow-emerald-500/40",
  "dark:ring-emerald-500/40",
].join(" ");
