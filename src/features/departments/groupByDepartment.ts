import type { DepartmentSummaries, DepartmentSummary, User } from "./types";

interface Accumulator extends Omit<DepartmentSummary, "ageRange"> {
  minAge: number;
  maxAge: number;
}

function createAccumulator(): Accumulator {
  return {
    male: 0,
    female: 0,
    minAge: Infinity,
    maxAge: -Infinity,
    hair: {},
    addressUser: {},
  };
}

/**
 * Summarises users per department in a single pass: O(n) time, and the
 * accumulators are mutated in place so no intermediate arrays are allocated.
 */
export function groupByDepartment(users: Iterable<User>): DepartmentSummaries {
  const accumulators = new Map<string, Accumulator>();

  for (const user of users) {
    const department = user.company.department;
    let summary = accumulators.get(department);
    if (!summary) {
      summary = createAccumulator();
      accumulators.set(department, summary);
    }

    summary[user.gender] += 1;
    if (user.age < summary.minAge) summary.minAge = user.age;
    if (user.age > summary.maxAge) summary.maxAge = user.age;
    summary.hair[user.hair.color] = (summary.hair[user.hair.color] ?? 0) + 1;
    summary.addressUser[user.firstName + user.lastName] =
      user.address.postalCode;
  }

  const result: DepartmentSummaries = {};
  for (const [department, { minAge, maxAge, ...summary }] of accumulators) {
    result[department] = { ...summary, ageRange: `${minAge}-${maxAge}` };
  }
  return result;
}
