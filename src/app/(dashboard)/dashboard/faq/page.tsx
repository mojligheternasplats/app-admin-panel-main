import { AdvancedAccordion, AccordionItemData } from "@/components/ui/advanced-accordion";
import { HelpCircle, Info, Settings, Users, BookOpen, Handshake, Newspaper } from "lucide-react";

export default function FaqPage() {
  const faqItems: AccordionItemData[] = [
    {
      value: "item-1",
      trigger: "What can I do on the dashboard?",
      content:
        "The dashboard provides a central hub for managing all aspects of your application's content. You can create, edit, and delete users, events, news articles, programs, and partners. It also features a centralized Media Library for all your images and videos.",
      icon: <Info className="h-5 w-5" />,
    },
    {
      value: "item-2",
      trigger: "How do I create new content like an Event or News Article?",
      content:
        "Navigate to the desired section (e.g., 'Events', 'News', 'Partners') from the sidebar. Click the 'Add' button (e.g., 'Add Event') to open a form. Fill in the details in the structured form, which is organized into sections like 'Main Details' and 'Publish Settings', and then click 'Save'.",
      icon: <Newspaper className="h-5 w-5" />,
      badge: { text: 'Content', variant: 'secondary' }
    },
    {
      value: "item-3",
      trigger: "What is the purpose of the Media Library?",
      content:
        "The Media Library is a centralized place to manage all your images and videos. You can upload new media here. This separation ensures that all media is managed in one place, making it easier to maintain. Currently, media items are not directly linked to other content types from the forms.",
      icon: <Info className="h-5 w-5" />,
      badge: { text: 'Media', variant: 'default' }
    },
    {
        value: "item-4",
        trigger: "How does the AI-powered slug generation work?",
        content: "When creating content like a news article or event, you can enter a title and then click the 'Generate Slug' button. This feature uses an AI model to create a URL-friendly and SEO-optimized slug from your title, saving you time and improving consistency.",
        icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      value: "item-5",
      trigger: "What are the different user roles?",
      content:
        "The system has three user roles: ADMIN, EDITOR, and USER. Admins have full control over the system. Editors can create and manage content but cannot manage users. Users have read-only access. You can assign roles when creating or editing a user.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: "item-6",
      trigger: "What is the difference between Programs and Partners?",
      content:
        "'Programs' are projects your organization runs, categorized as Local, EU, or International. 'Partners' are external organizations you collaborate with, such as Financiers or Collaborators. Both can be managed from their respective sections in the sidebar.",
      icon: <Handshake className="h-5 w-5" />,
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about using the admin dashboard.
        </p>
      </div>
      <div className="max-w-4xl mx-auto w-full">
         <AdvancedAccordion items={faqItems} defaultValue="item-1" />
      </div>
    </div>
  );
}
