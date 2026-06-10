"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Card from "@/components/Card";
import { noButtonBase } from "@/components/buttonStyles";

const CARD_NUMBER = "4441 1110 4604 4867";
const SHARE_TEXT =
  "Happy Wife — жартівливе нагадування: найкраща підтримка дружини — це увага та турбота. А проєкт можна підтримати за бажанням ☕️";

const WIFE_SUPPORT_TIPS = [
  "Приділіть час без телефону — просто поговоріть",
  "Допоможіть по дому або візьміть справи на себе",
  "Скажіть щось щире: «Дякую, що ти є»",
  "Запропонуйте спільну прогулянку чи улюблену активність",
];

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

interface FinishScreenProps {
  onRestart: () => void;
}

export default function FinishScreen({ onRestart }: FinishScreenProps) {
  const [copied, setCopied] = useState(false);
  const [confettiDone, setConfettiDone] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const showConfetti = !prefersReducedMotion && !confettiDone;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setTimeout(() => setConfettiDone(true), 3200);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Happy Wife",
      text: SHARE_TEXT,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the share sheet.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${SHARE_TEXT}\n${window.location.href}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <Card className="animate-screen-enter overflow-hidden">
      {showConfetti && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              className="confetti-piece"
              style={{
                left: `${(index * 17) % 100}%`,
                animationDelay: `${(index % 8) * 0.12}s`,
                backgroundColor:
                  index % 3 === 0
                    ? "#18181b"
                    : index % 3 === 1
                      ? "#a1a1aa"
                      : "#fbbf24",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative space-y-3 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          Офіційний висновок
        </p>

        <h1 className="text-balance bg-gradient-to-r from-zinc-950 via-zinc-600 to-zinc-950 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-400 dark:to-white sm:text-4xl">
          Найкращий спосіб підтримати дружину
        </h1>

        <p className="mx-auto max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
          Не скарга, а увага. Невеликі щоденні жести працюють краще за будь-які
          «перемоги» в суперечці. Ось з чого можна почати сьогодні:
        </p>
      </div>

      <ul className="mx-auto mt-5 grid max-w-lg gap-2 text-left sm:mt-6 sm:grid-cols-2 sm:gap-3">
        {WIFE_SUPPORT_TIPS.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-zinc-300"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            {tip}
          </li>
        ))}
      </ul>

      <div className="relative mt-6 space-y-2 text-center sm:mt-8">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
          За бажанням
        </p>

        <h2 className="text-balance text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
          Підтримати проєкт Happy Wife
        </h2>

        <p className="mx-auto max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
          Якщо Вам сподобалась ідея — можна залишити будь-яку суму на розвиток
          проєкту. Це не обовʼязково, але буде приємно.
        </p>
      </div>

      <div className="relative mt-4 flex justify-center sm:mt-5">
        <button
          type="button"
          onClick={handleCopy}
          className="group relative h-52 w-full max-w-sm cursor-pointer rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-600 p-6 text-left text-white shadow-2xl shadow-zinc-400/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:shadow-black/40"
          aria-label="Скопіювати номер картки для підтримки проєкту"
        >
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-10 w-14 rounded-xl bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-inner" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/90 text-xs font-bold text-emerald-950 animate-approved-check">
                  ✓
                </span>
                <div className="flex gap-1.5">
                  <span className="h-7 w-7 rounded-full bg-white/30 backdrop-blur-sm" />
                  <span className="-ml-4 h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <p className="font-mono text-lg font-semibold tracking-[0.2em] text-white/90">
                {CARD_NUMBER}
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
                    Для
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-wide">
                    Happy Wife
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
                    Сума
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-wide text-emerald-300">
                    Будь-яка
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {copied
          ? "Номер картки скопійовано!"
          : "Натисніть на картку, щоб скопіювати номер"}
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
        <button type="button" onClick={handleShare} className={noButtonBase}>
          Поділитися
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-zinc-950 ring-1 ring-zinc-200 transition-all duration-300 hover:bg-zinc-100 active:scale-[0.97] dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-800"
        >
          Почати спочатку
        </button>
      </div>
    </Card>
  );
}
