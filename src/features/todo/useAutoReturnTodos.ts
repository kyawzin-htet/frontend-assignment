import { useCallback, useEffect, useReducer, useRef } from "react";
import type { TodoItem } from "./data";
import { createInitialState, todoReducer } from "./todoReducer";

export const AUTO_RETURN_DELAY_MS = 5000;

type Timer = ReturnType<typeof setTimeout>;

/**
 * Moves items between the main list and their type column.
 * A categorized item returns to the bottom of the main list on its own after
 * `delayMs`, or immediately when `restore` is called.
 */
export function useAutoReturnTodos(
  items: TodoItem[],
  delayMs: number = AUTO_RETURN_DELAY_MS,
) {
  const [state, dispatch] = useReducer(todoReducer, items, createInitialState);
  const timers = useRef(new Map<string, Timer>());

  const restore = useCallback((name: string) => {
    clearTimeout(timers.current.get(name));
    timers.current.delete(name);
    dispatch({ type: "restore", name });
  }, []);

  const categorize = useCallback(
    (name: string) => {
      if (timers.current.has(name)) return;
      timers.current.set(
        name,
        setTimeout(() => restore(name), delayMs),
      );
      dispatch({ type: "categorize", name });
    },
    [delayMs, restore],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  return { ...state, categorize, restore };
}
