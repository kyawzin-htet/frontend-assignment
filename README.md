# 7 Solutions – Frontend Assignment

Next.js (App Router) + TypeScript + Tailwind CSS.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest
```

## 1. Auto Delete Todo List — `/`

- Clicking an item in the main list moves it to the column of its type.
- After 5 seconds it returns to the bottom of the main list.
- Clicking it in the column returns it immediately and cancels its timer.

| File | Responsibility |
| --- | --- |
| `src/features/todo/todoReducer.ts` | Pure state transitions (`categorize`, `restore`) |
| `src/features/todo/useAutoReturnTodos.ts` | One timer per item, cleared on manual return and on unmount |
| `src/features/todo/TodoBoard.tsx` | Presentation only |

## 2. Users grouped by department — `GET /api/departments`

Fetches <https://dummyjson.com/users> and returns a summary per department
(gender counts, age range, hair colours, name → postal code).

Performance choices:

- One upstream request (`limit=0`) with `select` so only the needed fields are transferred.
- Single-pass O(n) aggregation with in-place accumulators (`groupByDepartment.ts`).
- The response is cached and revalidated hourly.
