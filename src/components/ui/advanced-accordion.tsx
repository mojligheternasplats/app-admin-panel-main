"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

export interface AdvancedAccordionProps {
  items: AccordionItemData[];
  defaultValue?: string;
  className?: string;
}

const AdvancedAccordion = React.forwardRef<
  React.ElementRef<typeof Accordion>,
  AdvancedAccordionProps
>(({ items, defaultValue, className, ...props }, ref) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full rounded-lg border", className)}
      defaultValue={defaultValue}
      ref={ref}
      {...props}
    >
      {items.map((item, index) => (
        <AccordionItem
          value={item.value}
          key={item.value}
          className={cn(index === items.length - 1 && "border-b-0")}
        >
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              {item.icon && (
                <div className="text-muted-foreground">{item.icon}</div>
              )}
              <span className="flex-1 text-left">{item.trigger}</span>
              {item.badge && (
                <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
});

AdvancedAccordion.displayName = "AdvancedAccordion";

export { AdvancedAccordion };
