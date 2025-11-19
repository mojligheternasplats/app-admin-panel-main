
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
  DialogDescription,
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
import { YouthTestimonial } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { MediaPickerTrigger } from '@/components/dashboard/media/media-picker-trigger';
import { ClientDate } from '@/components/dashboard/client-date';

interface TestimonialFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  testimonial: YouthTestimonial | null;
  onSave: (testimonial: YouthTestimonial) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().int().min(10, "Age must be at least 10.").max(100, "Age must be less than 100."),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  program: z.string().min(2, { message: "Program must be at least 2 characters." }),
  imageUrl: z.string().optional(),
  isPublished: z.boolean(),
});

export function TestimonialForm({ isOpen, setIsOpen, testimonial, onSave }: TestimonialFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 18,
      message: '',
      program: '',
      imageUrl: '',
      isPublished: true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: testimonial?.name || '',
        age: testimonial?.age || 18,
        message: testimonial?.message || '',
        program: testimonial?.program || '',
        imageUrl: testimonial?.imageUrl || '',
        isPublished: testimonial?.isPublished ?? true,
      });
    }
  }, [testimonial, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let savedTestimonial: YouthTestimonial;
      if (testimonial?.id) {
        savedTestimonial = await api.put(`youth-testimonials/${testimonial.id}`, values);
        toast({ title: "Testimonial updated successfully." });
      } else {
        savedTestimonial = await api.post('youth-testimonials', values);
        toast({ title: "Testimonial created successfully." });
      }
      onSave(savedTestimonial);
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
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
          {testimonial && (
            <DialogDescription>
                Created at: <ClientDate dateString={testimonial.createdAt} />
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <MediaPickerTrigger value={field.value ?? ''} onSelect={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

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
