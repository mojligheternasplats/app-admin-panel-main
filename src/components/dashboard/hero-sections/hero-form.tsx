'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeroSection, HeroStatus, Lang } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientDate } from '../client-date';

interface HeroFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  section: HeroSection | null;
  onSave: (section: HeroSection) => void;
}

const formSchema = z.object({
  page: z.string().min(1, { message: "Page is required." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  language: z.enum(['Swedish', 'English', 'Somali']),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

const pageOptions = ["home", "events", "projects", "news"];
const languageOptions: Lang[] = ["Swedish", "English"];
const statusOptions: HeroStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function HeroForm({ isOpen, setIsOpen, section, onSave }: HeroFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page: section?.page || '',
      title: section?.title || '',
      subtitle: section?.subtitle || '',
      buttonText: section?.buttonText || '',
      buttonLink: section?.buttonLink || '',
      language: section?.language || 'Swedish',
      status: section?.status || 'DRAFT',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        page: section?.page || '',
        title: section?.title || '',
        subtitle: section?.subtitle || '',
        buttonText: section?.buttonText || '',
        buttonLink: section?.buttonLink || '',
        language: section?.language || 'Swedish',
        status: section?.status || 'DRAFT',
      });
    }
  }, [section, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let savedSection: HeroSection;
      if (section?.id) {
        savedSection = await api.put(`herosections/${section.id}`, values);
        toast({ title: "Hero Section updated successfully." });
      } else {
        savedSection = await api.post('herosections', values);
        toast({ title: "Hero Section created successfully." });
      }
      onSave(savedSection);
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed." });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {section ? "Edit Hero Section" : "Create Hero Section"}
          </DialogTitle>
          {section && (
            <DialogDescription>
                Last updated: <ClientDate dateString={section.updatedAt} />
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Page</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {pageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Button Link</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="/example-page" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {languageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
