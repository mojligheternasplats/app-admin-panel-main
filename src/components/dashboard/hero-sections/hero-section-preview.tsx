"use client";

import { HeroSection, Media } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroSectionPreviewProps {
    section: HeroSection;
}

export function HeroSectionPreview({ section }: HeroSectionPreviewProps) {
    const image: Media | undefined = section.media?.[0];

    console.log("section")
    return (
        <div className="border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="flex gap-2 items-center">
                    <Badge variant="outline">{section.page}</Badge>
                    <Badge
                        className={
                            section.status === "PUBLISHED"
                                ? "bg-green-500 text-white"
                                : section.status === "DRAFT"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-500 text-white"
                        }
                    >
                        {section.status}
                    </Badge>
                </div>
                <Badge>{section.language}</Badge>
            </div>

            {/* Hero Preview */}
            <div className="relative w-full h-72">
                {image ? (
                    <Image
                        src={image.url}
                        alt={image.altText ?? "Hero Image"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                        No image assigned
                    </div>
                )}

                {/* Centered Overlay text */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white">
                    <h2 className="text-2xl font-bold">{section.title}</h2>

                    {section.subtitle && (
                        <p className="max-w-2xl mt-2 text-sm opacity-90">{section.subtitle}</p>
                    )}

                    {section.buttonText && (
                        <Button variant="secondary" className="mt-4">
                            {section.buttonText}
                        </Button> 
                    )}
                </div>
            </div>

        </div>
    );
}
