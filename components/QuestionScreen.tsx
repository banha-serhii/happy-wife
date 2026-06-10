"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import EvadingButton from "@/components/EvadingButton";
import { noButtonBase, noButtonEmphasized } from "@/components/buttonStyles";

interface QuestionScreenProps {
  emoji: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  onYes: () => void;
  onNo: () => void;
  emphasizeNo?: boolean;
  yesRequiresCatch?: boolean;
}

export default function QuestionScreen({
  emoji,
  eyebrow,
  title,
  subtitle,
  onYes,
  onNo,
  emphasizeNo = false,
  yesRequiresCatch = false,
}: QuestionScreenProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);

  const handleAttemptsChange = (current: number, max: number) => {
    setAttempts(current);
    setMaxAttempts(max);
  };

  const progress =
    maxAttempts > 0 ? Math.min((attempts / maxAttempts) * 100, 100) : 0;

  return (
    <Card className="animate-screen-enter">
      <div className="flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-2xl text-white shadow-lg dark:from-white dark:to-zinc-200 dark:text-zinc-950 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl">
          <span aria-hidden="true">{emoji}</span>
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 sm:text-sm">
          {eyebrow}
        </p>

        <h1 className="max-w-2xl text-balance text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl md:text-3xl">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:mt-4 sm:text-base sm:leading-7">
          {subtitle}
        </p>
      </div>

      {yesRequiresCatch && attempts > 0 && maxAttempts > 0 && (
        <div className="mx-auto mt-5 w-full max-w-xs px-2 sm:mt-6">
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span>Спроби спіймати «Так»</span>
            <span>
              {attempts}/{maxAttempts}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-1 flex-col justify-end pt-6 sm:pt-8">
        <div className="mx-auto flex w-full max-w-[11rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <div
            ref={arenaRef}
            className="relative min-h-28 w-full sm:min-h-14 sm:max-w-[11rem] sm:flex-1"
          >
            <EvadingButton
              text="Так"
              onClick={onYes}
              boundsRef={arenaRef}
              requireCatchAttempts={yesRequiresCatch}
              onAttemptsChange={
                yesRequiresCatch ? handleAttemptsChange : undefined
              }
            />
          </div>

          <button
            type="button"
            onClick={onNo}
            className={[
              noButtonBase,
              emphasizeNo ? noButtonEmphasized : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {emphasizeNo ? "Ні, я передумав!" : "Ні"}
          </button>
        </div>
      </div>
    </Card>
  );
}
