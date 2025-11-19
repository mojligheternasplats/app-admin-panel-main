
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
import { Switch } from '@/components/ui/switch';
import { FileText, Loader2, Settings } from 'lucide-react';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AdvancedAccordion, AccordionItemData } from '@/components/ui/advanced-accordion';
import { api } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgramFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  program: Project | null;
  onSave: (program: Project) => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  isPublished: z.boolean(),
  language: z.enum(['Swedish', 'English']),
  order: z.number().int(),
  category: z.enum(['LOCAL', 'EU', 'INTERNATIONAL']),
});

export function ProgramForm({ isOpen, setIsOpen, program, onSave }: ProgramFormProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: program?.title || '',
      slug: program?.slug || '',
      content: program?.content || '',
      isPublished: program?.isPublished || false,
      language: program?.language || 'English',
      order: program?.order || 0,
      category: program?.category || 'LOCAL',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: program?.title || '',
        slug: program?.slug || '',
        content: program?.content || '',
        isPublished: program?.isPublished || false,
        language: program?.language || 'English',
        order: program?.order || 0,
        category: program?.category || 'LOCAL',
      });
    }
  }, [program, form, isOpen]);

  const handleGenerateSlug = async () => {
    const title = form.getValues('title');
    if (!title) return;
    setIsGeneratingSlug(true);
    try {
      const result = await api.post('generate-slug', { title });
      if (result.success) {
        form.setValue('slug', result.slug);
      } else {
        toast({
          variant: 'destructive',
          title: "Slug generation failed.",
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: "Slug generation failed.",
      });
    }
    setIsGeneratingSlug(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let savedProgram: Project;
      if (program?.id) {
        savedProgram = await api.put(`projects/${program.id}`, values);
        toast({ title: "Program updated." });
      } else {
        savedProgram = await api.post('projects', values);
        toast({ title: "Program created." });
      }
      onSave(savedProgram);
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed." });
    }
  }

  const formSections: AccordionItemData[] = [
    {
      value: "main-details",
      trigger: "Main Details",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
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
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" onClick={handleGenerateSlug} disabled={isGeneratingSlug}>
                    {isGeneratingSlug ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Slug"
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOCAL">Local</SelectItem>
                      <SelectItem value="EU">EU</SelectItem>
                      <SelectItem value="INTERNATIONAL">International</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      )
    },
    {
      value: "content-media",
      trigger: "Content",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )
    },
    {
      value: "publish-settings",
      trigger: "Publish Settings",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Published</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {program ? "Edit Program" : "Add Program"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdvancedAccordion items={formSections} defaultValue="main-details" />
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
