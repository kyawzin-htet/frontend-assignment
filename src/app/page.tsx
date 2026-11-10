import { TodoBoard } from "@/features/todo/TodoBoard";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Auto Delete Todo List
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Click an item to move it to its column. It returns to the bottom of
          the list after 5 seconds, or immediately when clicked again.
        </p>
      </header>
      <TodoBoard />
    </main>
  );
}
