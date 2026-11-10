import type { TodoItem } from "./data";

export interface TodoState {
  /** Items waiting in the main (left) list, in display order. */
  main: TodoItem[];
  /** Items currently sitting in a type column, in the order they were moved. */
  categorized: TodoItem[];
}

export type TodoAction =
  | { type: "categorize"; name: string }
  | { type: "restore"; name: string };

export function createInitialState(items: TodoItem[]): TodoState {
  return { main: items, categorized: [] };
}

/**
 * Both transitions are no-ops when the item is not in the expected list, so a
 * late timer firing after a manual click can never duplicate or lose an item.
 */
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "categorize": {
      const item = state.main.find((todo) => todo.name === action.name);
      if (!item) return state;
      return {
        main: state.main.filter((todo) => todo !== item),
        categorized: [...state.categorized, item],
      };
    }
    case "restore": {
      const item = state.categorized.find((todo) => todo.name === action.name);
      if (!item) return state;
      return {
        main: [...state.main, item],
        categorized: state.categorized.filter((todo) => todo !== item),
      };
    }
  }
}
