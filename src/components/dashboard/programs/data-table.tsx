
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
import { Project } from '@/lib/types';
import { ProgramForm } from './program-form';
import { columns } from './columns';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function ProgramDataTable({ data: initialData }: { data: Project[] }) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Project; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProgram, setSelectedProgram] = React.useState<Project | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.title?.toLowerCase() ?? '').includes(filter.toLowerCase())
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

  
  const requestSort = (key: keyof Project) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (program: Project) => {
    setSelectedProgram(program);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProgram(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await api.del(`projects/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Program deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete program." });
    }
  };

  const handleFormSave = (program: Project) => {
    if (selectedProgram) {
      setData(data.map(item => item.id === program.id ? program : item));
    } else {
      setData([...data, program]);
    }
    router.refresh();
  };

  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
            <Button onClick={handleAddNew}>Add Program</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof Project), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
      
          </Table>
        </CardContent>
      </Card>
      
      <ProgramForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen}
        program={selectedProgram}
        onSave={handleFormSave}
      />
    </div>
  );
}
