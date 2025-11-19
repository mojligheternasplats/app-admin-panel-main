
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
import { EventAttendanceUser } from '@/lib/types';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DataTableProps {
  data: EventAttendanceUser[];
}

export function AttendanceDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof EventAttendanceUser; direction: 'ascending' | 'descending' } | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.name?.toLowerCase() ?? '').includes(filter.toLowerCase()) ||
      (item.email?.toLowerCase() ?? '').includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
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

  const requestSort = (key: keyof EventAttendanceUser) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`event-attendance/registrations/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Attendee deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete attendee." });
    }
  };

  const handleRefresh = () => {
    router.refresh();
    toast({ title: 'Data refreshed.' });
  }

  const tableColumns = columns({ onDelete: handleDelete });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or email..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleRefresh} variant="outline" className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof EventAttendanceUser), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
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
                        {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof EventAttendanceUser] } })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    No attendees found for this event.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
