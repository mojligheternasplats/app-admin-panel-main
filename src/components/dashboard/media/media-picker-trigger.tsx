
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MediaPicker } from './media-picker';
import { Media } from '@/lib/types';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';

interface MediaPickerTriggerProps {
  value: string;
  onSelect: (value: string) => void;
}

export function MediaPickerTrigger({ value, onSelect }: MediaPickerTriggerProps) {
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [mediaItems, setMediaItems] = React.useState<Media[]>([]);

  React.useEffect(() => {
    if (isPickerOpen) {
      api.get('media?type=IMAGE').then(setMediaItems).catch(console.error);
    }
  }, [isPickerOpen]);

  const handleSelect = (media: Media) => {
    onSelect(media.url);
    setIsPickerOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="aspect-video relative rounded-md border border-dashed flex items-center justify-center">
          {value ? (
            <Image src={value} alt="Selected media" layout="fill" objectFit="contain" className="rounded-md" />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-8 w-8" />
              <p>No image selected</p>
            </div>
          )}
        </div>
        <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)} className="w-full">
          Select from Media Library
        </Button>
      </div>

      <MediaPicker
        isOpen={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        mediaItems={mediaItems}
        onSelect={handleSelect}
      />
    </>
  );
}
