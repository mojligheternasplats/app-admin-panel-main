
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Media, News, Event, Project, Partner,HeroSection } from '@/lib/types';
import { UploadMediaModal } from './upload-media-modal';
import { MediaEditForm } from './media-edit-form';
import { AssignMediaForm } from './assign-media-form';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function MediaDataTable({ data: initialData }: { data: Media[] }) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Media; direction: 'ascending' | 'descending' } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedMedia, setSelectedMedia] = React.useState<Media | null>(null);
const [assignableEntities, setAssignableEntities] = React.useState<{
  news: { data: News[] };
  events: { data: Event[] };
  projects: { data: Project[] };
  partners: { data: Partner[] };
  heroSections: { data: HeroSection[] };
}>({
  news: { data: [] },
  events: { data: [] },
  projects: { data: [] },
  partners: { data: [] },
  heroSections: { data: [] },
});

  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.altText?.toLowerCase() ?? '').includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof Media) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (media: Media) => {
    setSelectedMedia(media);
    setIsEditModalOpen(true);
  };

  const handleAssign = async (media: Media) => {
    setSelectedMedia(media);
    try {
      const [news, events, projects, partners, heroSections] = await Promise.all([
        api.get<any>('news'),
        api.get<any>('events'),
        api.get<any>('projects'),
        api.get<any>('partners'),
         api.get<any>('heroSections'),
      ]);

      setAssignableEntities({ news, events, projects, partners ,heroSections});
      setIsAssignModalOpen(true);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch items for assignment." });
    }
  };


  const handleAddNew = () => {
    setIsUploadModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`media/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Media deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete media." });
    }
  };

  const handleUploadSuccess = (newMedia: Media) => {
    setData(prevData => [newMedia, ...prevData]);
    setIsUploadModalOpen(false);
    router.refresh();
  };

  const handleEditSuccess = (updatedMedia: Media) => {
    setData(prevData => prevData.map(item => item.id === updatedMedia.id ? updatedMedia : item));
    setIsEditModalOpen(false);
    router.refresh();
  }

  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete, onAssign: handleAssign });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by alt text..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAddNew}>Add Media</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column, index) => (
                <TableHead key={index}>
                  {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof Media), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row) => (
                <TableRow key={row.id}>
                  {tableColumns.map((column, index) => (
                    <TableCell key={index}>
                      {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof Media] } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onSuccess={handleUploadSuccess}
      />
      {selectedMedia && (
        <>
          <MediaEditForm
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            media={selectedMedia}
            onSuccess={handleEditSuccess}
          />
          <AssignMediaForm
            isOpen={isAssignModalOpen}
            onOpenChange={setIsAssignModalOpen}
            media={selectedMedia}
            entities={assignableEntities}
          />
        </>
      )}
    </div>
  );
}
