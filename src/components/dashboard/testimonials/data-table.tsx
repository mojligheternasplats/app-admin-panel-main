
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
import { YouthTestimonial } from '@/lib/types';
import { TestimonialForm } from './testimonials-form';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface DataTableProps {
  data: YouthTestimonial[];
}

export function TestimonialDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof YouthTestimonial; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<YouthTestimonial | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.name?.toLowerCase() ?? '').includes(filter.toLowerCase()) ||
      (item.program?.toLowerCase() ?? '').includes(filter.toLowerCase())
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

  const requestSort = (key: keyof YouthTestimonial) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (testimonial: YouthTestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTestimonial(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`testimonials/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Testimonial deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete testimonial." });
    }
  };

  const handleFormSave = (testimonial: YouthTestimonial) => {
    if (selectedTestimonial) {
      setData(data.map(item => item.id === testimonial.id ? testimonial : item));
    } else {
      setData([...data, testimonial]);
    }
    router.refresh();
  }

  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or program..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddNew} className="ml-auto">Add Testimonial</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof YouthTestimonial), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
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
                        {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof YouthTestimonial] } })}
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
        </CardContent>
      </Card>
       <TestimonialForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen}
        testimonial={selectedTestimonial}
        onSave={handleFormSave}
      />
    </div>
  );
}
