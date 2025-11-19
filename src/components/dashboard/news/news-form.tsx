
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, FileText, ImageIcon, Settings } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { News } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AdvancedAccordion, AccordionItemData } from '@/components/ui/advanced-accordion';
import { api } from '@/lib/api';

interface NewsFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newsArticle: News | null;
  onSave: (news: News) => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  publishedDate: z.date(),
  isPublished: z.boolean(),
  language: z.enum(['Swedish', 'English']),
});

export function NewsForm({ isOpen, setIsOpen, newsArticle, onSave }: NewsFormProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: newsArticle?.title || '',
      slug: newsArticle?.slug || '',
      content: newsArticle?.content || '',
      publishedDate: newsArticle ? new Date(newsArticle.publishedDate) : new Date(),
      isPublished: newsArticle?.isPublished || false,
      language: newsArticle?.language || 'English',
    },
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: newsArticle?.title || '',
        slug: newsArticle?.slug || '',
        content: newsArticle?.content || '',
        publishedDate: newsArticle ? new Date(newsArticle.publishedDate) : new Date(),
        isPublished: newsArticle?.isPublished || false,
        language: newsArticle?.language || 'English',
      });
    }
  }, [newsArticle, form, isOpen]);

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
      const payload = {
        ...values,
        publishedDate: values.publishedDate.toISOString(),
      };
      let savedNews: News;
      if (newsArticle?.id) {
        savedNews = await api.put(`news/${newsArticle.id}`, payload);
        toast({ title: "News article updated successfully." });
      } else {
        savedNews = await api.post('news', payload);
        toast({ title: "News article created successfully." });
      }
      onSave(savedNews);
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
              name="publishedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value && isClient ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
            {newsArticle ? "Edit News Article" : "Add News Article"}
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
