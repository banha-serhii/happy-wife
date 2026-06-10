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
  const anchorRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [isCatchable, setIsCatchable] = useState(false);

  const handleAttemptsChange = (current: number, max: number) => {
    setAttempts(current);
    setMaxAttempts(max);
    setIsCatchable(max > 0 && current >= max);
  };

  const progress =
    maxAttempts > 0 ? Math.min((attempts / maxAttempts) * 100, 100) : 0;

  const remainingAttempts = Math.max(maxAttempts - attempts, 0);

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

      {yesRequiresCatch && maxAttempts > 0 && (
        <div className="mx-auto mt-4 w-full max-w-md px-1 sm:mt-6">
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span>Спроби натиснути «Так»</span>
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
          <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isCatchable
              ? "Можна натиснути «Так» 😅"
              : remainingAttempts > 0
                ? `Ще ${remainingAttempts} ${remainingAttempts === 1 ? "спроба" : remainingAttempts < 5 ? "спроби" : "спроб"}`
                : "Спробуйте натиснути «Так»"}
          </p>
        </div>
      )}

      <div className="relative z-10 mt-auto w-full pt-5 sm:pt-8">
        <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800 sm:pt-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Ваша відповідь
          </p>

          <div className="mx-auto w-full max-w-md px-1">
            <div className="grid grid-cols-2 items-center gap-3 sm:mx-auto sm:inline-grid sm:max-w-none sm:grid-cols-[11rem_11rem] sm:gap-4">
              <div
                ref={anchorRef}
                className="pointer-events-none box-border h-12 min-h-12 w-full min-w-0 rounded-2xl border border-transparent"
                aria-hidden="true"
              />

              <button
                ref={noButtonRef}
                type="button"
                onClick={onNo}
                className={[
                  noButtonBase,
                  "animate-no-button-enter",
                  emphasizeNo ? noButtonEmphasized : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="sm:hidden">
                  {emphasizeNo ? "Передумав" : "Ні"}
                </span>
                <span className="hidden sm:inline">
                  {emphasizeNo ? "Ні, я передумав!" : "Ні"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <EvadingButton
          text="Так"
          onClick={onYes}
          anchorRef={anchorRef}
          verticalAlignRef={noButtonRef}
          requireCatchAttempts={yesRequiresCatch}
          onAttemptsChange={
            yesRequiresCatch ? handleAttemptsChange : undefined
          }
        />
      </div>
    </Card>
  );
}
