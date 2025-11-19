
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface MediaEditFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  media: Media | null;
  onSuccess: (media: Media) => void;
}


const formSchema = z.object({
  title: z.string().optional(),
  altText: z.string().optional(),
  description: z.string().optional(),
});

export function MediaEditForm({ isOpen, onOpenChange, media, onSuccess }: MediaEditFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    title: '',
    altText: '',
    description: '',
  }
  });
  
  React.useEffect(() => {
    if (media) {
      form.reset({
        title: media.title || '',
        altText: media.altText || '',
        description: media.description || '',
      });
    }
  }, [media, form]);


  if (!media) return null;
  
  const handleClose = () => {
    if (isSubmitting) return;
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const updatedMedia = await api.put<Media>(`media/${media.id}`, values);
      toast({ title: 'Media updated successfully.' });
      onSuccess(updatedMedia);
      handleClose();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Update failed.', description: 'Could not update the media item.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                <Image src={media.url} alt={media.altText || "Media preview"} layout="fill" objectFit="contain" />
            </div>
            <FormField control={form.control} name="title" render={({ field }) => <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="altText" render={({ field }) => <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
             <DialogFooter>
                <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
