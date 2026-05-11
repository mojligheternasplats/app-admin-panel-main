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
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof User;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  // Memoize edit handler för att undvika onödiga omrenderingar av kolumner
  const handleEdit = React.useCallback((user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  }, []);

  // Memoize kolumner - Kritiskt för prestanda!
  const columns = React.useMemo(() => 
    userColumns({ onEdit: handleEdit, token }), 
    [handleEdit, token]
  );

  const filteredData = React.useMemo(() => {
    const query = filter.toLowerCase();
    return data.filter((item) => {
      const fullName = `${item.firstName ?? ""} ${item.lastName ?? ""}`.toLowerCase();
      const email = item.email?.toLowerCase() ?? "";
      return fullName.includes(query) || email.includes(query);
    });
  }, [data, filter]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = String(a[sortConfig.key] ?? "");
      const bVal = String(b[sortConfig.key] ?? "");

      const comparison = aVal.localeCompare(bVal, undefined, { 
        numeric: true, 
        sensitivity: "base" 
      });

      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof User) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
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
