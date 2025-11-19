'use client';

import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientDate } from '../client-date';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAction } from '@/app/actions';

type ColumnDef<TData, TValue> = {
  accessorKey: keyof TData | string;
  header: ({ column }: { column: any }) => React.ReactNode;
  cell: ({ row }: { row: any }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

const roles = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  USER: 'User'
};

interface ColumnsProps {
  onEdit: (user: User) => void;
}

export const columns = ({ onEdit }: ColumnsProps): ColumnDef<User, any>[] => [
  {
    accessorKey: 'select',
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      return <div className="font-medium">{fullName || "No name"}</div>;
    },
    enableSorting: false, // optional: disable sorting since it's computed
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Email</Button>,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Role</Button>,
    cell: ({ row }) => {
      const role = row.getValue('role') as User['role'];
      return (
        <Badge variant={role === 'ADMIN' ? 'default' : role === 'EDITOR' ? 'secondary' : 'outline'}>
          {roles[role]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Created At</Button>,
    cell: ({ row }) => <ClientDate dateString={row.getValue('createdAt')} />,
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right">
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="model" value="users" />
                <input type="hidden" name="token" value={localStorage.getItem("token") ?? ""} /> {/* ✅ Add this line */}
                  <AlertDialogAction type="submit">Confirm</AlertDialogAction>
                </form>
                

              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];