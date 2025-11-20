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
import { CalendarIcon, FileText, Loader2, MapPin, Settings } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AdvancedAccordion, AccordionItemData } from '@/components/ui/advanced-accordion';
import { api } from '@/lib/api';

interface EventFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  event: Event | null;
  onSave: (event: Event) => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  startDate: z.date(),
  isPublished: z.boolean(),
  openForRegistration: z.boolean(),
  language: z.enum(['Swedish', 'English']),
});

export function EventForm({ isOpen, setIsOpen, event, onSave }: EventFormProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || '',
      slug: event?.slug || '',
      content: event?.content || '',
      location: event?.location || '',
      startDate: event ? new Date(event.startDate) : new Date(),
      isPublished: event?.isPublished || false,
      openForRegistration: event?.openForRegistration || false,
      language: event?.language || 'English',
    },
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: event?.title || '',
        slug: event?.slug || '',
        content: event?.content || '',
        location: event?.location || '',
        startDate: event ? new Date(event.startDate) : new Date(),
        isPublished: event?.isPublished || false,
        openForRegistration: event?.openForRegistration || false,
        language: event?.language || 'English',
      });
    }
  }, [event, form, isOpen]);


  const handleGenerateSlug = async () => {
    const title = form.getValues('title');
    if (!title) return;

    setIsGeneratingSlug(true);

    try {
      const result = await api.post('generate-slug', { title });
      if (result?.slug) {
        form.setValue('slug', result.slug);
      } else {
        toast({ variant: 'destructive', title: "Slug generation failed." });
      }
    } catch {
      toast({ variant: 'destructive', title: "Slug generation failed." });
    }

    setIsGeneratingSlug(false);
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
      };

      let savedEvent: Event;

      if (event?.id) {
        savedEvent = await api.put(`events/${event.id}`, payload);
        toast({ title: "Event updated successfully." });
      } else {
        savedEvent = await api.post('events', payload);
        toast({ title: "Event created successfully." });
      }

      onSave(savedEvent);
      setIsOpen(false);

    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed." });
    }
  }


  // ---------------- ACCORDION SECTIONS --------------------

  const formSections: AccordionItemData[] = [
    {
      value: "main-details",
      trigger: "Main Details",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SLUG */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <div className="flex gap-2">
                  <FormControl><Input {...field} /></FormControl>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSlug}
                    disabled={isGeneratingSlug}
                  >
                    {isGeneratingSlug ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : "Generate Slug"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
      )
    },

    {
      value: "event-specifics",
      trigger: "Event Specifics",
      icon: <MapPin className="h-5 w-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* LOCATION */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE PICKER */}
          <FormField
            control={form.control}
            name="startDate"
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
                        {field.value && isClient ? format(field.value, 'PPP') : "Pick a date"}
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
        <div className="space-y-4">
          {/* PUBLISHED */}
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Published</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* OPEN FOR REGISTRATION */}
          <FormField
            control={form.control}
            name="openForRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Open for Registration</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <AdvancedAccordion items={formSections} defaultValue="main-details" />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" type="button">Cancel</Button>
              </DialogClose>

              <Button type="submit">Save</Button>
            </DialogFooter>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
}
