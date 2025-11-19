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
import { Event } from '@/lib/types';
import { EventForm } from './event-form';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface DataTableProps {
  data: Event[];
}

export function EventDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Event; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.title?.toLowerCase() ?? '').includes(filter.toLowerCase()) ||
      (item.location?.toLowerCase() ?? '').includes(filter.toLowerCase())
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


  const requestSort = (key: keyof Event) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`events/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Event deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete event." });
    }
  };

  const handleFormSave = (event: Event) => {
    if (selectedEvent) {
      setData(data.map(item => item.id === event.id ? event : item));
    } else {
      setData([...data, event]);
    }
    router.refresh();
  }

  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddNew} className="ml-auto">Add Event</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column, index) => (
                <TableHead key={index}>
                  {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof Event), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
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
                      {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof Event] } })}
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
       <EventForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen}
        event={selectedEvent}
        onSave={handleFormSave}
      />
    </div>
  );
}
