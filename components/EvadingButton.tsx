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
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

interface Position {
  x: number;
  y: number;
}

interface EvadingButtonProps {
  text: string;
  onClick: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
  requireCatchAttempts?: boolean;
  onAttemptsChange?: (attempts: number, max: number) => void;
}

const SAFE_PADDING = 12;
const DESKTOP_SLIDE_MS = 400;
const MOBILE_SLIDE_MS = 220;
const DESKTOP_MIN_MOVE = 64;
const MOBILE_MIN_MOVE = 80;
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

function getViewportLimits(buttonWidth: number, buttonHeight: number) {
  const maxX = Math.max(
    SAFE_PADDING,
    window.innerWidth - buttonWidth - SAFE_PADDING,
  );
  const maxY = Math.max(
    SAFE_PADDING,
    window.innerHeight - buttonHeight - SAFE_PADDING,
  );

  return { maxX, maxY };
}

function getEffectiveMinMove(maxX: number, maxY: number, requested: number) {
  const rangeX = Math.max(0, maxX - SAFE_PADDING);
  const rangeY = Math.max(0, maxY - SAFE_PADDING);
  const largestRange = Math.max(rangeX, rangeY);

  return Math.min(requested, Math.max(32, largestRange * 0.25));
}

function getRandomViewportPosition(
  buttonWidth: number,
  buttonHeight: number,
  requestedMinMove: number,
  current?: Position,
): Position {
  const { maxX, maxY } = getViewportLimits(buttonWidth, buttonHeight);
  const minMove = getEffectiveMinMove(maxX, maxY, requestedMinMove);
  const rangeX = Math.max(0, maxX - SAFE_PADDING);
  const rangeY = Math.max(0, maxY - SAFE_PADDING);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidate = {
      x: Math.round(Math.random() * rangeX + SAFE_PADDING),
      y: Math.round(Math.random() * rangeY + SAFE_PADDING),
    };

    if (!current) {
      return candidate;
    }

    const distance = Math.hypot(
      candidate.x - current.x,
      candidate.y - current.y,
    );

    if (distance >= minMove) {
      return candidate;
    }
  }

  if (current) {
    return {
      x: current.x > window.innerWidth / 2 ? SAFE_PADDING : maxX,
      y: current.y > window.innerHeight / 2 ? SAFE_PADDING : maxY,
    };
  }

  return { x: SAFE_PADDING, y: SAFE_PADDING };
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function getAnchorPosition(
  anchor: DOMRect,
  buttonWidth: number,
  buttonHeight: number,
): Position {
  const { maxX, maxY } = getViewportLimits(buttonWidth, buttonHeight);

  return {
    x: Math.round(
      clamp(
        anchor.left + (anchor.width - buttonWidth) / 2,
        SAFE_PADDING,
        maxX,
      ),
    ),
    y: Math.round(
      clamp(
        anchor.top + (anchor.height - buttonHeight) / 2,
        SAFE_PADDING,
        maxY,
      ),
    ),
  };
}

export default function EvadingButton({
  text,
  onClick,
  anchorRef,
  className = "",
  requireCatchAttempts = false,
  onAttemptsChange,
}: EvadingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hasMovedRef = useRef(false);
  const [randomAttempts] = useState(() =>
    typeof window === "undefined"
      ? ATTEMPTS_MIN
      : rollRequiredAttempts(window.matchMedia("(pointer: coarse)").matches),
  );
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>();
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const isClient = useIsClient();

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
    if (!requireCatchAttempts || !onAttemptsChange) {
      return;
    }

    onAttemptsChange(attempts, requiredAttempts);
  }, [attempts, onAttemptsChange, requireCatchAttempts, requiredAttempts]);

  const clampToViewport = useCallback(
    (current: Position, buttonWidth: number, buttonHeight: number): Position => {
      const { maxX, maxY } = getViewportLimits(buttonWidth, buttonHeight);

      return {
        x: clamp(current.x, SAFE_PADDING, maxX),
        y: clamp(current.y, SAFE_PADDING, maxY),
      };
    },
    [],
  );

  const layoutButton = useCallback(() => {
    const anchor = anchorRef.current;
    const button = buttonRef.current;

    if (!anchor || !button) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setButtonWidth(anchorRect.width > 0 ? anchorRect.width : undefined);

    setPosition((current) => {
      if (!hasMovedRef.current) {
        return getAnchorPosition(anchorRect, buttonRect.width, buttonRect.height);
      }

      if (!current) {
        return getAnchorPosition(anchorRect, buttonRect.width, buttonRect.height);
      }

      return clampToViewport(current, buttonRect.width, buttonRect.height);
    });
    setIsReady(true);
  }, [anchorRef, clampToViewport]);

  useEffect(() => {
    layoutButton();

    const anchor = anchorRef.current;
    const observer =
      anchor && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(layoutButton)
        : null;

    observer?.observe(anchor as Element);

    window.addEventListener("resize", layoutButton);
    window.addEventListener("scroll", layoutButton, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", layoutButton);
      window.removeEventListener("scroll", layoutButton);
    };
  }, [anchorRef, layoutButton]);

  const moveButton = useCallback(
    (countAttempt = false) => {
      if (reducedMotion || !buttonRef.current) {
        return;
      }

      hasMovedRef.current = true;

      if (requireCatchAttempts && countAttempt) {
        setAttempts((current) => current + 1);
      }

      const buttonRect = buttonRef.current.getBoundingClientRect();

      setPosition((current) =>
        getRandomViewportPosition(
          buttonRect.width,
          buttonRect.height,
          minMoveDistance,
          current ?? undefined,
        ),
      );
    },
    [minMoveDistance, reducedMotion, requireCatchAttempts],
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
    if (!isCoarsePointer && (!requireCatchAttempts || !isCatchable)) {
      evade(false);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    if (!isCoarsePointer) {
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

  const remainingAttempts = Math.max(requiredAttempts - attempts, 0);

  const liveMessage = !requireCatchAttempts
    ? ""
    : isCatchable
      ? "Тепер можна натиснути кнопку Так"
      : `Спроба ${attempts} з ${requiredAttempts}. Залишилось ${remainingAttempts}`;

  const button = (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
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
        position: "fixed",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        width: buttonWidth,
        zIndex: 50,
        transition: reducedMotion
          ? "none"
          : `left ${slideDurationMs}ms cubic-bezier(0.34, 1.2, 0.64, 1), top ${slideDurationMs}ms cubic-bezier(0.34, 1.2, 0.64, 1), width 200ms ease`,
      }}
    >
      {isCatchable && requireCatchAttempts ? `${text} 😅` : text}
    </button>
  );

  return (
    <>
      {requireCatchAttempts && (
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </span>
      )}

      {isClient ? createPortal(button, document.body) : button}
    </>
  );
}
