"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, PaginatedResponse } from "@/lib/admin-types";
import { UserDataTable } from "@/components/dashboard/users/data-table";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  api.getAll<User>("users", { page: 1, limit: 10, sort: "createdAt:desc" })
    .then((res: PaginatedResponse<User>) => {
          console.log("API response:", res.data);
      setUsers(res.data);
      console.log(users) // ✅ Use `items` from PaginatedResponse
    })
    .catch((err) => console.error("Failed to load users:", err))
    .finally(() => setLoading(false));
}, []);
 
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Users</h1>
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserDataTable data={users} />
      )}
    </div>
  );
}
