"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { columns as userColumns } from "./columns";
import { UserForm } from "./user-form";

interface DataTableProps {
  data?: User[]; // ✅ Gör data valfri för att hantera undefined
  hideControls?: boolean;
}

export function UserDataTable({ data = [], hideControls = false }: DataTableProps) {
  const [token, setToken] = React.useState("");
  const [filter, setFilter] = React.useState("");
React.useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) setToken(storedToken);
}, []);
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof User;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

const filteredData = React.useMemo(() => {
  return data.filter((item) => {
    const fullName = `${item.firstName ?? ""} ${item.lastName ?? ""}`.toLowerCase();
    const email = item.email?.toLowerCase() ?? "";
    const query = filter.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });
}, [data, filter]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      const aVal = aValue === undefined || aValue === null ? "" : String(aValue);
      const bVal = bValue === undefined || bValue === null ? "" : String(bValue);

      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" });

      if (comparison < 0) return sortConfig.direction === "ascending" ? -1 : 1;
      if (comparison > 0) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof User) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const fakeTable = {
    getIsAllPageRowsSelected: () => false,
    getIsSomePageRowsSelected: () => false,
    toggleAllPageRowsSelected: () => {},
  };

const columns = userColumns({ onEdit: handleEdit, token });
  return (
    <div>
      {!hideControls && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddNew} className="ml-auto">
            Add User
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column: any, index: number) => (
                <TableHead key={index}>
                  {column.header({
                    column: {
                      toggleSorting: () => requestSort(column.accessorKey),
                      getIsSorted: () =>
                        sortConfig?.key === column.accessorKey
                          ? sortConfig?.direction === "ascending"
                            ? "asc"
                            : "desc"
                          : false,
                    },
                    table: fakeTable,
                  })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column: any, index: number) => (
                    <TableCell key={index}>
                      {column.cell({
                        row: {
                          ...row,
                          original: row,
                          getValue: (key: string) => row[key as keyof User],
                          getIsSelected: () => false,
                          toggleSelected: () => {},
                        },
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UserForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} user={selectedUser} />
    </div>
  );
}
