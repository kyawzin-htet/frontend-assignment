import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_TODOS } from "./data";
import { TodoBoard } from "./TodoBoard";
import { AUTO_RETURN_DELAY_MS } from "./useAutoReturnTodos";

const column = (name: string) => screen.getByRole("region", { name });
const namesIn = (name: string) =>
  within(column(name))
    .queryAllByRole("button")
    .map((button) => button.textContent);
const click = (columnName: string, item: string) =>
  fireEvent.click(within(column(columnName)).getByRole("button", { name: item }));
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("TodoBoard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    render(<TodoBoard />);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("starts with every item in the main list", () => {
    expect(namesIn("Main list")).toEqual(INITIAL_TODOS.map((todo) => todo.name));
    expect(namesIn("Fruit")).toEqual([]);
    expect(namesIn("Vegetable")).toEqual([]);
  });

  it("moves a clicked item into the column of its type", () => {
    click("Main list", "Apple");
    click("Main list", "Broccoli");

    expect(namesIn("Fruit")).toEqual(["Apple"]);
    expect(namesIn("Vegetable")).toEqual(["Broccoli"]);
    expect(namesIn("Main list")).not.toContain("Apple");
    expect(namesIn("Main list")).not.toContain("Broccoli");
  });

  it("returns an item to the bottom of the main list after 5 seconds", () => {
    click("Main list", "Apple");

    advance(AUTO_RETURN_DELAY_MS - 1);
    expect(namesIn("Fruit")).toEqual(["Apple"]);

    advance(1);
    expect(namesIn("Fruit")).toEqual([]);
    expect(namesIn("Main list").at(-1)).toBe("Apple");
    expect(namesIn("Main list")).toHaveLength(INITIAL_TODOS.length);
  });

  it("gives each item its own 5 second timer", () => {
    click("Main list", "Apple");
    advance(2000);
    click("Main list", "Banana");

    advance(3000);
    expect(namesIn("Fruit")).toEqual(["Banana"]);

    advance(2000);
    expect(namesIn("Fruit")).toEqual([]);
    expect(namesIn("Main list").slice(-2)).toEqual(["Apple", "Banana"]);
  });

  it("returns an item immediately when clicked in its column", () => {
    click("Main list", "Tomato");
    click("Vegetable", "Tomato");

    expect(namesIn("Vegetable")).toEqual([]);
    expect(namesIn("Main list").at(-1)).toBe("Tomato");
  });

  it("cancels the pending timer after a manual return", () => {
    click("Main list", "Apple");
    advance(4000);
    click("Fruit", "Apple");

    // Move it again: the first timer must not send it back 1s later.
    click("Main list", "Apple");
    advance(1000);
    expect(namesIn("Fruit")).toEqual(["Apple"]);

    advance(4000);
    expect(namesIn("Fruit")).toEqual([]);
    expect(namesIn("Main list")).toHaveLength(INITIAL_TODOS.length);
  });
});
