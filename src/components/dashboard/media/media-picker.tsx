
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Media } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaPickerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mediaItems: Media[];
  onSelect: (media: Media) => void;
}

export function MediaPicker({
  isOpen,
  onOpenChange,
  mediaItems,
  onSelect,
}: MediaPickerProps) {
  const [filter, setFilter] = React.useState('');
  const isMobile = useIsMobile();

  const filteredMedia = mediaItems.filter(item =>
    (item.altText || '').toLowerCase().includes(filter.toLowerCase())
  );

  const Content = () => (
    <div className="flex flex-col gap-4 h-full">
      <Input
        placeholder="Search media..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ScrollArea className="flex-grow">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pr-4">
          {filteredMedia.map(item => (
            <Card
              key={item.id}
              className="group relative cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <CardContent className="p-0">
                {item.mediaType === 'IMAGE' ? (
                  <Image
                    src={item.url}
                    alt={item.altText || 'Media preview'}
                    width={200}
                    height={150}
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full rounded-md bg-secondary flex items-center justify-center">
                    <video src={item.url} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                  <span className="text-white text-sm font-bold">Select</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[80%]">
          <SheetHeader>
            <SheetTitle>Select Media</SheetTitle>
            <SheetDescription>Choose an image or video from your media library.</SheetDescription>
          </SheetHeader>
          <div className="py-4 h-full">
            <Content />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>Choose an image or video from your media library.</DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
