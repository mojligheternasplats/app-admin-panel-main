'use client';

import { HeroSection } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react';
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
import { ClientDate } from '../client-date';
import { cn } from '@/lib/utils';

type ColumnDef<TData, TValue> = {
  accessorKey: keyof TData | string;
  header: ({ column }: { column: any }) => React.ReactNode;
  cell: ({ row }: { row: any }) => React.ReactNode;
}

interface ColumnsProps {
  onEdit: (section: HeroSection) => void;
  onDelete: (id: string) => void;
  onPreview: (section: HeroSection) => void; // ✅ Added
}

const statusVariantMap: { [key in HeroSection['status']]: 'default' | 'secondary' | 'outline' } = {
  PUBLISHED: 'default',
  DRAFT: 'secondary',
  ARCHIVED: 'outline',
};

export const columns = ({ onEdit, onDelete, onPreview }: ColumnsProps): ColumnDef<HeroSection, any>[] => [
  {
    accessorKey: 'page',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Page</Button>,
    cell: ({ row }) => <div className="font-medium capitalize">{row.getValue('page')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Title</Button>,
    cell: ({ row }) => <div>{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'language',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Language</Button>,
    cell: ({ row }) => <div>{row.getValue('language')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Status</Button>,
    cell: ({ row }) => {
      const status = row.getValue('status') as HeroSection['status'];
      return (
        <Badge variant={statusVariantMap[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Last Updated</Button>,
    cell: ({ row }) => <ClientDate dateString={row.getValue('updatedAt')} />,
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const section = row.original;
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
                
                {/* ✅ PREVIEW BUTTON ADDED HERE */}
                <DropdownMenuItem onClick={() => onPreview(section)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit(section)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className={cn("text-red-600")}>
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
                  This action cannot be undone. 
                  {section.status === 'PUBLISHED' && <b className="text-destructive-foreground"> This section is live on the website.</b>}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(section.id)}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
