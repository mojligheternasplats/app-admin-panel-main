
'use client';

import * as React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';

export function ImageUploadForm() {
  const { control, setValue, watch, register } = useFormContext();
  const imageUrl = watch('url');

  register('file'); // Register the 'file' field

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        // This sets the preview URL
        setValue('url', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="url" // We still bind to `url` for validation and preview
        render={() => (
          <FormItem>
            <FormLabel>Image File</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {imageUrl && typeof imageUrl === 'string' && (
        <div className="mt-4">
          <FormLabel>Image Preview</FormLabel>
          <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
              <Image src={imageUrl} alt="Image preview" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}
      <FormField
        control={control}
        name="altText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alternative Text</FormLabel>
            <FormControl>
              <Textarea placeholder="A description of the image for accessibility" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
