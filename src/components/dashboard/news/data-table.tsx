
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
import { News } from '@/lib/types';
import { NewsForm } from './news-form';
import { columns } from './columns';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function NewsDataTable({ data: initialData }: { data: News[] }) {
  const [data, setData] = React.useState(initialData);
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof News; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedNews, setSelectedNews] = React.useState<News | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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

  const requestSort = (key: keyof News) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (news: News) => {
    setSelectedNews(news);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedNews(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await api.del(`news/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "News article deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete news article." });
    }
  };

  const handleFormSave = (newsArticle: News) => {
    if (selectedNews) {
      setData(data.map(item => item.id === newsArticle.id ? newsArticle : item));
    } else {
      setData([...data, newsArticle]);
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
            <Button onClick={handleAddNew}>Add News Article</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof News), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
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
                        {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof News] } })}
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
      
      <NewsForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen}
        newsArticle={selectedNews}
        onSave={handleFormSave}
      />
    </div>
  );
}
