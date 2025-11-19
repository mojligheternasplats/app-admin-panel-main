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
import { HeroSection, HeroStatus, Lang } from '@/lib/types';
import { columns } from './columns';
import { HeroForm } from './hero-form';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HeroSectionPreview } from './hero-section-preview';
interface DataTableProps {
  data: HeroSection[];
}

const pageOptions = ["Home", "Events", "Projects", "News"];
const statusOptions: HeroStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const languageOptions: Lang[] = ["Swedish", "English"];

export function HeroDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData);
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof HeroSection; direction: 'ascending' | 'descending' } | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<HeroSection | null>(null);
  // ✅ PREVIEW STATE
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewSection, setPreviewSection] = React.useState<HeroSection | null>(null);

  // Filters
  const [titleFilter, setTitleFilter] = React.useState('');
  const [pageFilter, setPageFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [languageFilter, setLanguageFilter] = React.useState('all');

  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    return data.filter(item =>
      (item.title.toLowerCase().includes(titleFilter.toLowerCase())) &&
      (pageFilter === 'all' || item.page.toLowerCase() === pageFilter.toLowerCase()) &&
      (statusFilter === 'all' || item.status === statusFilter) &&
      (languageFilter === 'all' || item.language === languageFilter)
    );
  }, [data, titleFilter, pageFilter, statusFilter, languageFilter]);

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


  const requestSort = (key: keyof HeroSection) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (section: HeroSection) => {
    setSelectedSection(section);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSection(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`herosections/${id}`);
      setData(data.filter(item => item.id !== id));
      toast({ title: "Hero Section deleted successfully." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete hero section." });
    }
  };

  const handleFormSave = (section: HeroSection) => {
    if (selectedSection) {
      setData(data.map(item => item.id === section.id ? section : item));
    } else {
      setData([...data, section]);
    }
    router.refresh();
  }

  const handlePreview = (section: HeroSection) => {
    setPreviewSection(section);
    setIsPreviewOpen(true);
  };


  const tableColumns = columns({ onEdit: handleEdit, onDelete: handleDelete, onPreview: handlePreview });

  return (
    <div>
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <Input
          placeholder="Search by title..."
          value={titleFilter}
          onChange={(event) => setTitleFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={pageFilter} onValueChange={setPageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by page..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {pageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by language..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAddNew} className="ml-auto">Add Section</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableHead key={index}>
                    {column.header({ column: { toggleSorting: () => requestSort(column.accessorKey as keyof HeroSection), getIsSorted: () => sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : false } })}
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
                        {column.cell({ row: { ...row, original: row, getValue: (key: string) => row[key as keyof HeroSection] } })}
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
      {/* ✅ Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview: {previewSection?.title}</DialogTitle>
          </DialogHeader>

          {previewSection && (
            <HeroSectionPreview section={previewSection} />
          )}
        </DialogContent>
      </Dialog>

      <HeroForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        section={selectedSection}
        onSave={handleFormSave}
      />
    </div>
  );
}
