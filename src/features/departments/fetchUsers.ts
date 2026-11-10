import type { User } from "./types";

// `limit=0` returns every user in one request, and `select` trims the payload
// to the fields the summary actually reads.
const USERS_URL =
  "https://dummyjson.com/users?limit=0&select=firstName,lastName,age,gender,hair,address,company";

const REVALIDATE_SECONDS = 60 * 60;

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(USERS_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    throw new Error(`dummyjson responded with ${response.status}`);
  }
  const body: { users: User[] } = await response.json();
  return body.users;
}
