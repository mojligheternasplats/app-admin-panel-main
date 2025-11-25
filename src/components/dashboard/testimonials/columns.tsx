
'use client';

import { YouthTestimonial } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
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
import Image from 'next/image';

type ColumnDef<TData, TValue> = {
  accessorKey: keyof TData | string;
  header: ({ column }: { column: any }) => React.ReactNode;
  cell: ({ row }: { row: any }) => React.ReactNode;
}

interface ColumnsProps {
  onEdit: (testimonial: YouthTestimonial) => void;
  onDelete: (id: string) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<YouthTestimonial, any>[] => [
  {
    accessorKey: 'imageUrl',
    header: () => 'Image',
    cell: ({ row }) => {
        const imageUrl = row.getValue('imageUrl');
        const name = row.getValue('name');
        return imageUrl ? (
            <Image
                src={imageUrl as string}
                alt={`Image of ${name}`}
                width={40}
                height={40}
                className="rounded-full object-cover h-10 w-10"
            />
        ) : <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">No Img</div>;
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Name</Button>,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Age</Button>,
    cell: ({ row }) => <div>{row.getValue('age')}</div>,
  },
  {
    accessorKey: 'program',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Program</Button>,
    cell: ({ row }) => <div>{row.getValue('program')}</div>,
  },
  
    {
    accessorKey: 'isPublished',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Status</Button>,
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished');
      return (
        <Badge variant={isPublished ? 'default' : 'outline'}>
          {isPublished ? "Published" : "Unpublished"}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const testimonial = row.original;
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
                <DropdownMenuItem onClick={() => onEdit(testimonial)}>
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
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(testimonial.id)}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
