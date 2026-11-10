/** The subset of a dummyjson user that the summary needs. */
export interface User {
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
  hair: { color: string };
  address: { postalCode: string };
  company: { department: string };
}

export interface DepartmentSummary {
  male: number;
  female: number;
  /** Youngest and oldest age in the department, e.g. "24-51". */
  ageRange: string;
  /** Hair colour -> number of people. */
  hair: Record<string, number>;
  /** `${firstName}${lastName}` -> postal code. */
  addressUser: Record<string, string>;
}

export type DepartmentSummaries = Record<string, DepartmentSummary>;
