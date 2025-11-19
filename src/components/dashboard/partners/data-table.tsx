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
import { Partner } from '@/lib/types';
import { PartnerForm } from './partner-form';
import { columns } from './columns';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function PartnerDataTable({ data: initialData }: { data: Partner[] }) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Partner; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<Partner | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.name?.toLowerCase() ?? '').includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);
  
  const requestSort = (key: keyof Partner) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPartner(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await api.del(`partners/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Partner deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete partner." });
    }
  };

  const handleFormSave = (partner: Partner) => {
    if (selectedPartner) {
      setData(data.map(item => item.id === partner.id ? partner : item));
    } else {
      setData([...data, partner]);
    }
    router.refresh();
  };

  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAddNew}>Add Partner</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({
                      column: {
                        toggleSorting: () => requestSort(column.accessorKey as keyof Partner),
                        getIsSorted: () =>
                          sortConfig?.key === column.accessorKey
                            ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc')
                            : false,
                      },
                    })}
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
                        {column.cell({
                          row: {
                            ...row,
                            original: row,
                            getValue: (key: string) => row[key as keyof Partner],
                          },
                        })}
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
      
      <PartnerForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen}
        partner={selectedPartner}
        onSave={handleFormSave}
      />
    </div>
  );
}
