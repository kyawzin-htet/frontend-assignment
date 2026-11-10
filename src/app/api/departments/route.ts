import { fetchUsers } from "@/features/departments/fetchUsers";
import { groupByDepartment } from "@/features/departments/groupByDepartment";

export async function GET() {
  try {
    const users = await fetchUsers();
    return Response.json(groupByDepartment(users));
  } catch (error) {
    console.error("Failed to build department summary", error);
    return Response.json(
      { message: "Unable to load users from the upstream API" },
      { status: 502 },
    );
  }
}
