"use client";

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
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Media, News, Event, Project, Partner, HeroSection } from '@/lib/types';

import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AssignMediaFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    media: Media | null;
    entities: {
        news: { data: News[] };
        events: { data: Event[] };
        projects: { data: Project[] };
        partners: { data: Partner[] };
        heroSections: { data: HeroSection[] };
    };
}


const formSchema = z.object({
    entityType: z.enum(['NEWS', 'EVENT', 'PROJECT', 'PARTNER', 'HERO_SECTION']),
    entityId: z.string().min(1, { message: 'Please select an item.' }),
});

export function AssignMediaForm({ isOpen, onOpenChange, media, entities }: AssignMediaFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { entityType: undefined, entityId: '' },
    });

    const selectedType = form.watch("entityType");

    const itemsToDisplay =
        selectedType === "NEWS"
            ? entities.news.data
            : selectedType === "EVENT"
                ? entities.events.data
                : selectedType === "PROJECT"
                    ? entities.projects.data
                    : selectedType === "PARTNER"
                        ? entities.partners.data
                        : selectedType === "HERO_SECTION"
                            ? entities.heroSections.data
                            : [];

    console.log("itemsToDisplay", itemsToDisplay)
    React.useEffect(() => {
        if (isOpen) form.reset({ entityType: undefined, entityId: '' });
    }, [isOpen, form]);

    if (!media) return null;

    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        console.log("📤 Assign Media Payload:", {
            mediaId: media?.id,
            entityId: values.entityId,
            entityType: values.entityType,
        });

        // ✅ Validate required fields before sending to backend
        if (!media?.id) {
            toast({ variant: "destructive", title: "Missing media ID" });
            setIsSubmitting(false);
            return;
        }

        if (!values.entityId) {
            toast({ variant: "destructive", title: "Please select a content item first." });
            setIsSubmitting(false);
            return; // ❗ Stop execution
        }

        if (!values.entityType) {
            toast({ variant: "destructive", title: "Please select what type of content to attach to." });
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post('media/attach', {
                mediaId: media.id,
                entityId: values.entityId,
                entityType: values.entityType,
            });

            toast({ title: '✅ Media assigned successfully.' });
            handleClose();
        } catch (error) {
            console.error("❌ Assign media error:", error);
            toast({
                variant: 'destructive',
                title: 'Assignment failed',
                description: 'Could not assign the media item.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Assign Media</DialogTitle>
                    <DialogDescription>Attach this media to any content item.</DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                            <Image src={media.url} alt={media.altText ?? "Media preview"} fill className="object-contain" />
                        </div>

                        {/* Select entity type */}
                        <FormField
                            control={form.control}
                            name="entityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="NEWS">News</SelectItem>
                                            <SelectItem value="EVENT">Event</SelectItem>
                                            <SelectItem value="PROJECT">Project</SelectItem>
                                            <SelectItem value="PARTNER">Partner</SelectItem>
                                            <SelectItem value="HERO_SECTION">Hero Section</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select a specific item */}
                        {selectedType && (
                            <FormField
                                control={form.control}
                                name="entityId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select {selectedType}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Choose a ${selectedType.toLowerCase()}...`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {itemsToDisplay.length > 0 ? (
                                                    itemsToDisplay.map(item => (
                                                        <SelectItem key={item.id} value={item.id}>{item?.slug}</SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                                        No events available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !selectedType}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Assign
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
