"use client";

import {
  yesButtonBase,
  yesButtonCatchable,
  yesButtonEvading,
} from "@/components/buttonStyles";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Position {
  x: number;
  y: number;
}

interface EvadingButtonProps {
  text: string;
  onClick: () => void;
  boundsRef: RefObject<HTMLElement | null>;
  className?: string;
  /** Потрібно «спіймати» кнопку випадкову кількість разів перед кліком. */
  requireCatchAttempts?: boolean;
  onAttemptsChange?: (attempts: number, max: number) => void;
}

const SAFE_PADDING = 4;
const DESKTOP_SLIDE_MS = 400;
const MOBILE_SLIDE_MS = 260;
const DESKTOP_MIN_MOVE = 48;
const MOBILE_MIN_MOVE = 88;
const ATTEMPTS_MIN = 4;
const ATTEMPTS_MAX = 7;
const TOUCH_EXTRA_MIN = 1;
const TOUCH_EXTRA_MAX = 2;

function rollRequiredAttempts(isCoarsePointer: boolean): number {
  const base =
    ATTEMPTS_MIN +
    Math.floor(Math.random() * (ATTEMPTS_MAX - ATTEMPTS_MIN + 1));

  if (!isCoarsePointer) {
    return base;
  }

  const extra =
    TOUCH_EXTRA_MIN +
    Math.floor(Math.random() * (TOUCH_EXTRA_MAX - TOUCH_EXTRA_MIN + 1));

  return base + extra;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRandomPosition(
  containerWidth: number,
  containerHeight: number,
  buttonWidth: number,
  buttonHeight: number,
  minMoveDistance: number,
  current?: Position,
): Position {
  const maxX = Math.max(
    SAFE_PADDING,
    containerWidth - buttonWidth - SAFE_PADDING,
  );
  const maxY = Math.max(
    SAFE_PADDING,
    containerHeight - buttonHeight - SAFE_PADDING,
  );

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const candidate = {
      x: Math.round(
        Math.random() * (maxX - SAFE_PADDING) + SAFE_PADDING,
      ),
      y: Math.round(
        Math.random() * (maxY - SAFE_PADDING) + SAFE_PADDING,
      ),
    };

    if (!current) {
      return candidate;
    }

    const distance = Math.hypot(
      candidate.x - current.x,
      candidate.y - current.y,
    );

    if (distance >= minMoveDistance) {
      return candidate;
    }
  }

  return {
    x: Math.round(clamp(maxX, SAFE_PADDING, maxX)),
    y: Math.round(clamp(maxY, SAFE_PADDING, maxY)),
  };
}

function getCenteredPosition(
  containerWidth: number,
  containerHeight: number,
  buttonWidth: number,
  buttonHeight: number,
): Position {
  return {
    x: Math.round((containerWidth - buttonWidth) / 2),
    y: Math.round((containerHeight - buttonHeight) / 2),
  };
}

export default function EvadingButton({
  text,
  onClick,
  boundsRef,
  className = "",
  requireCatchAttempts = false,
  onAttemptsChange,
}: EvadingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [randomAttempts] = useState(() =>
    typeof window === "undefined"
      ? ATTEMPTS_MIN
      : rollRequiredAttempts(window.matchMedia("(pointer: coarse)").matches),
  );
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const slideDurationMs = isCoarsePointer ? MOBILE_SLIDE_MS : DESKTOP_SLIDE_MS;
  const minMoveDistance = isCoarsePointer ? MOBILE_MIN_MOVE : DESKTOP_MIN_MOVE;
  const requiredAttempts = requireCatchAttempts ? randomAttempts : 0;
  const isCatchable =
    !requireCatchAttempts || reducedMotion || attempts >= requiredAttempts;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");

    const syncPreferences = () => {
      setReducedMotion(motionQuery.matches);
      setIsCoarsePointer(coarseQuery.matches);
    };

    syncPreferences();
    motionQuery.addEventListener("change", syncPreferences);
    coarseQuery.addEventListener("change", syncPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncPreferences);
      coarseQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (!requireCatchAttempts) {
      return;
    }

    onAttemptsChange?.(attempts, requiredAttempts);
  }, [attempts, onAttemptsChange, requireCatchAttempts, requiredAttempts]);

  const layoutButton = useCallback(() => {
    const container = boundsRef.current;
    const button = buttonRef.current;

    if (!container || !button) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setPosition((current) => {
      if (!current) {
        return getCenteredPosition(
          containerRect.width,
          containerRect.height,
          buttonRect.width,
          buttonRect.height,
        );
      }

      return {
        x: clamp(
          current.x,
          SAFE_PADDING,
          containerRect.width - buttonRect.width - SAFE_PADDING,
        ),
        y: clamp(
          current.y,
          SAFE_PADDING,
          containerRect.height - buttonRect.height - SAFE_PADDING,
        ),
      };
    });
    setIsReady(true);
  }, [boundsRef]);

  useEffect(() => {
    layoutButton();

    const container = boundsRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(layoutButton);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [boundsRef, layoutButton]);

  const moveButton = useCallback(
    (countAttempt = false) => {
      if (reducedMotion || !boundsRef.current || !buttonRef.current) {
        return;
      }

      if (requireCatchAttempts && countAttempt) {
        setAttempts((current) => current + 1);
      }

      const containerRect = boundsRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setPosition((current) =>
        getRandomPosition(
          containerRect.width,
          containerRect.height,
          buttonRect.width,
          buttonRect.height,
          minMoveDistance,
          current ?? undefined,
        ),
      );
    },
    [boundsRef, minMoveDistance, reducedMotion, requireCatchAttempts],
  );

  const evade = useCallback(
    (countAttempt: boolean) => {
      if (requireCatchAttempts && isCatchable) {
        return;
      }

      moveButton(requireCatchAttempts && countAttempt);
    },
    [isCatchable, moveButton, requireCatchAttempts],
  );

  const handleClick = () => {
    if (isCatchable) {
      onClick();
      return;
    }

    evade(true);
  };

  const handleMouseEnter = () => {
    if (!isCoarsePointer) {
      evade(requireCatchAttempts);
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerType !== "touch") {
      return;
    }

    if (requireCatchAttempts && !isCatchable) {
      event.preventDefault();
      evade(true);
      return;
    }

    if (!requireCatchAttempts) {
      evade(false);
    }
  };

  const liveMessage =
    requireCatchAttempts && !isCatchable && attempts > 0
      ? `Спроба ${attempts} з ${requiredAttempts}`
      : requireCatchAttempts && isCatchable
        ? "Тепер можна натиснути кнопку Так"
        : "";

  return (
    <>
      {requireCatchAttempts && (
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </span>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onPointerDown={handlePointerDown}
        aria-label={
          isCatchable && requireCatchAttempts
            ? `${text}, натисніть для підтвердження`
            : text
        }
        className={[
          yesButtonBase,
          isCatchable && requireCatchAttempts
            ? yesButtonCatchable
            : yesButtonEvading,
          !isReady ? "invisible" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          left: position?.x ?? 0,
          top: position?.y ?? 0,
          transition: reducedMotion
            ? "none"
            : `left ${slideDurationMs}ms cubic-bezier(0.34, 1.2, 0.64, 1), top ${slideDurationMs}ms cubic-bezier(0.34, 1.2, 0.64, 1)`,
        }}
      >
        {isCatchable && requireCatchAttempts ? `${text} 😅` : text}
      </button>
    </>
  );
}
