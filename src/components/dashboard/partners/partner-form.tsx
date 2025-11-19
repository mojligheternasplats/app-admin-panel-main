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
import { FileText, ImageIcon, Loader2 } from 'lucide-react';
import { Partner } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AdvancedAccordion, AccordionItemData } from '@/components/ui/advanced-accordion';
import { api } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';


interface PartnerFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  partner: Partner | null;
  onSave: (partner: Partner) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  slug: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  logoUrl: z.string().optional(),
  logo: z.instanceof(File).optional(),
  type: z.enum(["FINANCIER", "COLLABORATOR", "EU_PROJECT", "INTERNATIONAL_PROJECT"]),
  isPublished: z.boolean(),
  language: z.enum(['Swedish', 'English']),
  order: z.coerce.number().int(),
});

export function PartnerForm({ isOpen, setIsOpen, partner, onSave }: PartnerFormProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partner?.name || '',
      slug: partner?.slug || '',
      website: partner?.website || '',
      logoUrl: partner?.logoUrl || '',
      type: partner?.type || 'COLLABORATOR',
      isPublished: partner?.isPublished || false,
      language: partner?.language || 'English',
      order: partner?.order || 0,
    },
  });

  const watchLogoFile = form.watch('logo');
  const watchLogoUrl = form.watch('logoUrl');
  const [filePreview, setFilePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (watchLogoFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(watchLogoFile);
    } else {
      setFilePreview(null);
    }
  }, [watchLogoFile]);

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: partner?.name || '',
        slug: partner?.slug || '',
        website: partner?.website || '',
        logoUrl: partner?.logoUrl || '',
        logo: undefined,
        type: partner?.type || 'COLLABORATOR',
        isPublished: partner?.isPublished || false,
        language: partner?.language || 'English',
        order: partner?.order || 0,
      });
      setFilePreview(null);
    }
  }, [partner, form, isOpen]);

  const handleGenerateSlug = async () => {
    const name = form.getValues('name');
    if (!name) return;
    setIsGeneratingSlug(true);
    try {
      const result = await api.post('generate-slug', { title: name });
      if (result.success) form.setValue('slug', result.slug);
      else throw new Error("Failed");
    } catch {
      toast({ variant: 'destructive', title: "Slug generation failed." });
    }
    setIsGeneratingSlug(false);
  };

async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsSubmitting(true);

  try {
    const formData = new FormData();

    // Append all scalar fields except logo
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'logo' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append file only if selected
    if (values.logo) {
      formData.append("logo", values.logo);
    }

    let savedPartner: Partner;

    if (partner?.id) {
      // ✅ Correct PUT call (using your api.update)
      savedPartner = await api.update("partners", partner.id, formData);
      toast({ title: "Partner updated." });

    } else {
      // ✅ Correct POST call for create
      savedPartner = await api.post("partners", formData, true);
      toast({ title: "Partner created." });
    }

    onSave(savedPartner);
    setIsOpen(false);

  } catch (error) {
    console.error("Submission error:", error);
    toast({ variant: "destructive", title: "Operation failed." });
  } finally {
    setIsSubmitting(false);
  }
}


  const formSections: AccordionItemData[] = [
    {
      value: "partner-details",
      trigger: "Partner Details",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="website" render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl><Input placeholder="https://example.com" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="FINANCIER">Financier</SelectItem>
                  <SelectItem value="COLLABORATOR">Collaborator</SelectItem>
                  <SelectItem value="EU_PROJECT">EU Project</SelectItem>
                  <SelectItem value="INTERNATIONAL_PROJECT">International Project</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="order" render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl><Input type="number" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      ),
    },
    {
      value: "branding",
      trigger: "Branding & SEO",
      icon: <ImageIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <FormField control={form.control} name="logo" render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {(filePreview || watchLogoUrl) && (
            <div className="mt-2 relative w-32 aspect-square rounded-md overflow-hidden border">
              <Image src={filePreview || watchLogoUrl || ''} alt="Logo preview" fill className="object-contain" />
            </div>
          )}

          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex gap-2">
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <Button type="button" variant="outline" onClick={handleGenerateSlug} disabled={isGeneratingSlug || isSubmitting}>
                  {isGeneratingSlug ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : "Generate"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      ),
    },
    {
      value: "publish-settings",
      trigger: "Publish Settings",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <FormField control={form.control} name="language" render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Swedish">Swedish</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="isPublished" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>Published</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
              </FormControl>
            </FormItem>
          )} />
        </div>
      ),
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader><DialogTitle>{partner ? "Edit Partner" : "Add Partner"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdvancedAccordion items={formSections} defaultValue="partner-details" />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
