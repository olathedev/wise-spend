"use client";

import { useState, useEffect, useRef } from "react";

const TICK_MS = 20;
const DEFAULT_CHARS_PER_TICK = 5;

export function useTypewriter(
  text: string | null,
  options?: { charsPerTick?: number; enabled?: boolean }
) {
  const charsPerTick = options?.charsPerTick ?? DEFAULT_CHARS_PER_TICK;
  const enabled = options?.enabled ?? true;

  const [visibleLength, setVisibleLength] = useState(0);
  const fullLength = text?.length ?? 0;
  const prevTextRef = useRef(text);

  // Reset when text content changes (new analysis)
  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      setVisibleLength(0);
    }
  }, [text]);

  // Animate visible length
  useEffect(() => {
    if (!enabled || !text || visibleLength >= fullLength) return;

    const id = setInterval(() => {
      setVisibleLength((prev) => Math.min(prev + charsPerTick, fullLength));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [enabled, text, fullLength, visibleLength, charsPerTick]);

  const visibleText = text ? text.slice(0, visibleLength) : "";
  const isComplete = fullLength > 0 && visibleLength >= fullLength;

  return { visibleText, isComplete };
}
