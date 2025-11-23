
'use client';

import { Media } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit, Link2 } from 'lucide-react';
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
import Image from 'next/image';

type ColumnDef<TData, TValue> = {
  accessorKey: keyof TData | string;
  header: ({ column }: { column: any }) => React.ReactNode;
  cell: ({ row }: { row: any }) => React.ReactNode;
}

interface ColumnsProps {
  onDelete: (id: string) => void;
  onAssign: (media: Media) => void;
}

export const columns = ({onDelete, onAssign }: ColumnsProps): ColumnDef<Media, any>[] => [
  {
    accessorKey: 'url',
    header: () => 'Preview',
    cell: ({ row }) => {
      const media = row.original;
      return media.mediaType === 'IMAGE' ? (
        <Image
          src={media.url}
          alt={media.altText || 'Media preview'}
          width={80}
          height={60}
          className="aspect-[4/3] rounded-md object-cover"
        />
      ) : (
        <div className="aspect-[4/3] w-[80px] rounded-md bg-secondary flex items-center justify-center">
            <video src={media.url} className="w-full h-full object-cover" />
        </div>
      );
    },
  },
  {
    accessorKey: 'altText',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Alt Text</Button>,
    cell: ({ row }) => <div className="font-medium">{row.getValue('altText')}</div>,
  },
  {
    accessorKey: 'mediaType',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Type</Button>,
    cell: ({ row }) => {
      const type = row.getValue('mediaType');
      return (
        <Badge variant={type === 'IMAGE' ? 'secondary' : 'outline'}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Uploaded At</Button>,
    cell: ({ row }) => <ClientDate dateString={row.getValue('createdAt')} />,
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const media = row.original;
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
       
                <DropdownMenuItem onClick={() => onAssign(media)}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Assign
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
                  <AlertDialogAction onClick={() => onDelete(media.id)}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
