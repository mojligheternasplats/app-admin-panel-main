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
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface UploadMediaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: (media: Media) => void;
}

/* SCHEMAS */
const fileSchema = z.object({
  file: z.instanceof(File, { message: 'A file is required.' }),
  altText: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
  entityType: z.enum(['NEWS', 'EVENT', 'PROJECT', 'PARTNER', 'GALLERY_COMPONENT'])
});

const urlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  altText: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
  entityType: z.enum(['NEWS', 'EVENT', 'PROJECT', 'PARTNER', 'GALLERY_COMPONENT'])
});

type Tab = 'file' | 'url';

export function UploadMediaModal({ isOpen, onOpenChange, onSuccess }: UploadMediaModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<Tab>('file');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);

  /* Forms */
  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
      altText: '',
      mediaType: 'IMAGE',
      entityType: 'GALLERY_COMPONENT',  // default
    },
  });

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
      altText: '',
      mediaType: 'IMAGE',
      entityType: 'GALLERY_COMPONENT',  // default
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
    setIsSubmitting(true);

    // ❌ STOP if file is missing
    if (!values.file) {
      toast({ variant: "destructive", title: "A file is required." });
      return;
    }

    // ❌ STOP if mediaType is missing
    if (!values.mediaType) {
      toast({ variant: "destructive", title: "Media type is required." });
      return;
    }

    // ❌ STOP if entityType is missing
    if (!values.entityType) {
      toast({ variant: "destructive", title: "Entity type is required." });
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("altText", values.altText ?? "");
    formData.append("mediaType", values.mediaType);
    formData.append("entityType", values.entityType);

    // Log for debugging (optional)
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 🚀 SEND to API
    const savedMedia: Media = await api.post("media/file", formData, true);

    toast({ title: "Media uploaded." });

    onSuccess(savedMedia);
    handleClose();

  } catch (error) {
    console.error("Upload error:", error);
    toast({ variant: "destructive", title: "Upload failed." });
  } finally {
    setIsSubmitting(false);
  }
}

  /* URL UPLOAD */
  async function onUrlSubmit(values: z.infer<typeof urlSchema>) {
    try {
      setIsSubmitting(true);
      const savedMedia: Media = await api.post('media/url', {
        url: values.url,
        altText: values.altText ?? '',
        mediaType: values.mediaType,
      });

      toast({ title: 'Media added.' });
      onSuccess(savedMedia);
      handleClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed.' });
    } finally {
      setIsSubmitting(false);
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

        <FormProvider {...(currentForm as any)}>
          <form onSubmit={currentForm.handleSubmit(currentSubmit as any)}>
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
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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

                <FormField
                  control={fileForm.control}
                  name="altText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={fileForm.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <FormControl>
                        <select {...field} className="border rounded p-2">
                          <option value="IMAGE">Image</option>
                          <option value="VIDEO">Video</option>
                          <option value="DOCUMENT">Document</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={fileForm.control}
                  name="entityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Type</FormLabel>
                      <FormControl>
                        <select {...field} className="border rounded p-2">
                          <option value="GALLERY_COMPONENT">Gallery</option>
                          <option value="NEWS">News</option>
                          <option value="EVENT">Event</option>
                          <option value="PROJECT">Project</option>
                          <option value="PARTNER">Partner</option>
                        </select>
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
                  name="altText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={fileForm.control}
                    name="mediaType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Media Type</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full border rounded p-2">
                            <option value="IMAGE">Image</option>
                            <option value="VIDEO">Video</option>
                            <option value="DOCUMENT">Document</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fileForm.control}
                    name="entityType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Entity Type</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full border rounded p-2">
                            <option value="GALLERY_COMPONENT">Gallery</option>
                            <option value="NEWS">News</option>
                            <option value="EVENT">Event</option>
                            <option value="PROJECT">Project</option>
                            <option value="PARTNER">Partner</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>



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
