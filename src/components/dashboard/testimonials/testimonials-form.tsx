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
import { FileText, Settings, User, ImageIcon } from 'lucide-react';
import { YouthTestimonial } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { ClientDate } from '@/components/dashboard/client-date';
import { AdvancedAccordion, AccordionItemData } from '@/components/ui/advanced-accordion';
import Image from 'next/image';

interface TestimonialFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  testimonial: YouthTestimonial | null;
  onSave: (testimonial: YouthTestimonial) => void;
}

const formSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().int().min(10).max(100),
  message: z.string().min(10),
  program: z.string().min(2),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  image: z.instanceof(File).optional(),
  isPublished: z.boolean(),
});

export function TestimonialForm({ isOpen, setIsOpen, testimonial, onSave }: TestimonialFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial?.name || '',
      age: testimonial?.age || 18,
      message: testimonial?.message || '',
      program: testimonial?.program || '',
      imageUrl: testimonial?.imageUrl || '',
      imagePublicId: testimonial?.imagePublicId || '',
      image: undefined,
      isPublished: testimonial?.isPublished ?? true,
    },
  });

  /** ------------------------------
   *  🔥 FILE PREVIEW
   --------------------------------*/
  const watchFile = form.watch('image');
  const watchUrl = form.watch('imageUrl');
  const [filePreview, setFilePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (watchFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(watchFile);
    } else {
      setFilePreview(null);
    }
  }, [watchFile]);

  /** ------------------------------
   *  🔥 RESET WHEN OPEN
   --------------------------------*/
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: testimonial?.name || '',
        age: testimonial?.age || 18,
        message: testimonial?.message || '',
        program: testimonial?.program || '',
        imageUrl: testimonial?.imageUrl || '',
        imagePublicId: testimonial?.imagePublicId || '',
        image: undefined,
        isPublished: testimonial?.isPublished ?? true,
      });
      setFilePreview(null);
    }
  }, [testimonial, isOpen]);

  /** ------------------------------
   *  🔥 SUBMIT
   --------------------------------*/
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Attach text fields
      formData.append("name", values.name);
      formData.append("age", String(values.age));
      formData.append("message", values.message);
      formData.append("program", values.program);
      formData.append("isPublished", String(values.isPublished));

      if (values.imagePublicId) {
        formData.append("imagePublicId", values.imagePublicId);
      }
      if (values.imageUrl) {
        formData.append("imageUrl", values.imageUrl);
      }

      // Attach image file
      if (values.image) {
        formData.append("image", values.image);
      }

      let saved: YouthTestimonial;

      if (testimonial?.id) {
        saved = await api.update("testimonials", testimonial.id, formData);
        toast({ title: "Testimonial updated." });
      } else {
        saved = await api.create("testimonials", formData);
        toast({ title: "Testimonial created." });
      }

      onSave(saved);
      setIsOpen(false);

    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Could not save testimonial" });
    } finally {
      setIsSubmitting(false);
    }
  }

  /** ------------------------------
   *  FORM SECTIONS
   --------------------------------*/
  const formSections: AccordionItemData[] = [
    {
      value: "personal",
      trigger: "Personal Details",
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="age" render={({ field }) => (
            <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      )
    },
    {
      value: "program",
      trigger: "Program",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <FormField control={form.control} name="program" render={({ field }) => (
          <FormItem><FormLabel>Program</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      )
    },
    {
      value: "message",
      trigger: "Message",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      )
    },
    {
      value: "image",
      trigger: "Image",
      icon: <ImageIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <FormField control={form.control} name="image" render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {(filePreview || watchUrl) && (
            <div className="relative w-32 aspect-square border rounded overflow-hidden">
              <Image src={filePreview || watchUrl || ''} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>
      )
    },
    {
      value: "publish",
      trigger: "Publish Settings",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <FormField control={form.control} name="isPublished" render={({ field }) => (
          <FormItem className="flex justify-between border p-3 rounded">
            <FormLabel>Published</FormLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormItem>
        )} />
      )
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          {testimonial && (
            <DialogDescription>
              Created at: <ClientDate dateString={testimonial.createdAt} />
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdvancedAccordion items={formSections} defaultValue="personal" />

            <DialogFooter>
              <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
