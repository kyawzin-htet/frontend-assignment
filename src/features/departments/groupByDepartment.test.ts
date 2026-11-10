import { describe, expect, it } from "vitest";
import { groupByDepartment } from "./groupByDepartment";
import type { User } from "./types";

function user(overrides: Partial<User> & { department?: string } = {}): User {
  const { department = "Engineering", ...rest } = overrides;
  return {
    firstName: "Terry",
    lastName: "Medhurst",
    age: 30,
    gender: "male",
    hair: { color: "Black" },
    address: { postalCode: "10000" },
    company: { department },
    ...rest,
  };
}

describe("groupByDepartment", () => {
  it("returns an empty object when there are no users", () => {
    expect(groupByDepartment([])).toEqual({});
  });

  it("summarises a single user", () => {
    expect(groupByDepartment([user()])).toEqual({
      Engineering: {
        male: 1,
        female: 0,
        ageRange: "30-30",
        hair: { Black: 1 },
        addressUser: { TerryMedhurst: "10000" },
      },
    });
  });

  it("aggregates users of the same department", () => {
    const result = groupByDepartment([
      user({ age: 45 }),
      user({
        firstName: "Emily",
        lastName: "Johnson",
        age: 22,
        gender: "female",
        hair: { color: "Brown" },
        address: { postalCode: "29112" },
      }),
      user({ firstName: "Sam", lastName: "Lee", age: 31 }),
    ]);

    expect(result).toEqual({
      Engineering: {
        male: 2,
        female: 1,
        ageRange: "22-45",
        hair: { Black: 2, Brown: 1 },
        addressUser: {
          TerryMedhurst: "10000",
          EmilyJohnson: "29112",
          SamLee: "10000",
        },
      },
    });
  });

  it("keeps departments separate", () => {
    const result = groupByDepartment([
      user({ department: "Engineering", age: 20 }),
      user({ department: "Support", age: 50, gender: "female" }),
    ]);

    expect(Object.keys(result)).toEqual(["Engineering", "Support"]);
    expect(result.Engineering).toMatchObject({ male: 1, female: 0, ageRange: "20-20" });
    expect(result.Support).toMatchObject({ male: 0, female: 1, ageRange: "50-50" });
  });
});
