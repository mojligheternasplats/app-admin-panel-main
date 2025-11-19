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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface UploadMediaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: (media: Media) => void;
}

/* SCHEMAS */
const fileSchema = z.object({
  file: z.instanceof(File, { message: 'An image file is required.' }),
  title: z.string().optional(),
  altText: z.string().optional(),
  description: z.string().optional(),
});

const urlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().optional(),
  altText: z.string().optional(),
  description: z.string().optional(),
});

type Tab = 'file' | 'url';

export function UploadMediaModal({ isOpen, onOpenChange, onSuccess }: UploadMediaModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<Tab>('file');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);

  /* FIXED: defaultValues prevent uncontrolled → controlled warning */
  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
      title: '',
      altText: '',
      description: '',
    },
  });

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
      title: '',
      altText: '',
      description: '',
    },
  });

  const watchFile = fileForm.watch('file');
  const watchUrl = urlForm.watch('url');

  /* FILE PREVIEW */
  React.useEffect(() => {
    if (watchFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(watchFile);
    } else {
      setFilePreview(null);
    }
  }, [watchFile]);

  /* CLOSE + RESET */
  const handleClose = () => {
    if (isSubmitting) return;
    fileForm.reset();
    urlForm.reset();
    setFilePreview(null);
    onOpenChange(false);
  };

  /* FILE UPLOAD */
  async function onFileSubmit(values: z.infer<typeof fileSchema>) {
  try {
    let savedMedia: Media;

    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('title', values.title ?? "");
    formData.append('altText', values.altText ?? "");
    formData.append('description', values.description ?? "");

    savedMedia = await api.post('media/file', formData, true);

    toast({ title: "Media uploaded." });
    onSuccess(savedMedia);
    handleClose();

  } catch (error) {
    toast({ variant: "destructive", title: "Upload failed." });
  }
}


  /* URL UPLOAD */
 async function onUrlSubmit(values: z.infer<typeof urlSchema>) {
  try {
    let savedMedia: Media;

    savedMedia = await api.post('media/url', {
      url: values.url,
      title: values.title || "",
      altText: values.altText || "",
      description: values.description || "",
    });
   

    toast({ title: "Media added." });
    onSuccess(savedMedia);
    handleClose();

  } catch (error) {
    toast({ variant: "destructive", title: "Upload failed." });
  }
}


  const currentForm = activeTab === 'file' ? fileForm : urlForm;
  const currentSubmit = activeTab === 'file' ? onFileSubmit : onUrlSubmit;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
        </DialogHeader>

        <FormProvider {...currentForm}>
          <form onSubmit={currentForm.handleSubmit(currentSubmit  as any)}>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
              </TabsList>

              {/* FILE TAB */}
              <TabsContent value="file" className="space-y-4 py-4">
                <FormField
                  control={fileForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {filePreview && (
                  <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image src={filePreview} alt="Preview" fill className="object-contain" />
                  </div>
                )}

                {/* OPTIONAL FIELDS */}
                <FormField
                  control={fileForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={fileForm.control}
                  name="altText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={fileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

              </TabsContent>

              {/* URL TAB */}
              <TabsContent value="url" className="space-y-4 py-4">

                <FormField
                  control={urlForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchUrl && urlForm.formState.isValid && (
                  <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image src={watchUrl} alt="Preview" fill className="object-contain" />
                  </div>
                )}

                <FormField
                  control={urlForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={urlForm.control}
                  name="altText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={urlForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
