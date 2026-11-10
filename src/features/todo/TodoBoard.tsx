"use client";

import { INITIAL_TODOS, TODO_TYPES, type TodoItem } from "./data";
import { useAutoReturnTodos } from "./useAutoReturnTodos";

interface TodoButtonProps {
  item: TodoItem;
  onClick: (name: string) => void;
}

function TodoButton({ item, onClick }: TodoButtonProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(item.name)}
        className="w-full cursor-pointer rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-xs transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:scale-[0.98]"
      >
        {item.name}
      </button>
    </li>
  );
}

export function TodoBoard() {
  const { main, categorized, categorize, restore } =
    useAutoReturnTodos(INITIAL_TODOS);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      <section aria-label="Main list">
        <ul className="flex flex-col gap-2">
          {main.map((item) => (
            <TodoButton key={item.name} item={item} onClick={categorize} />
          ))}
        </ul>
      </section>

      {TODO_TYPES.map((type) => (
        <section
          key={type}
          aria-label={type}
          className="flex min-h-64 flex-col overflow-hidden rounded-md border border-zinc-300 bg-white sm:min-h-[36rem]"
        >
          <h2 className="border-b border-zinc-300 bg-zinc-100 py-2.5 text-center text-sm font-semibold text-zinc-800">
            {type}
          </h2>
          <ul className="flex flex-col gap-2 p-2">
            {categorized
              .filter((item) => item.type === type)
              .map((item) => (
                <TodoButton key={item.name} item={item} onClick={restore} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
