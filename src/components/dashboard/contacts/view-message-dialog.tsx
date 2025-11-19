'use client';

import { useState } from "react";
import { ContactMessage, ContactStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ViewContactMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage | null;
  onStatusUpdate: (updated: ContactMessage) => void;
}

const statusOptions: ContactStatus[] = ["UNREAD", "READ", "REPLIED", "ARCHIVED"];

export function ViewContactMessageDialog({
  isOpen,
  onClose,
  message,
  onStatusUpdate
}: ViewContactMessageDialogProps) {

  const { toast } = useToast();
  const [status, setStatus] = useState<ContactStatus>(message?.status ?? "UNREAD");

  const handleSaveStatus = async () => {
    if (!message) return;

    try {
      const updated = await api.update<ContactMessage>(`contact`, message.id, { status });
      onStatusUpdate(updated);
      toast({ title: "Status updated successfully." });
      onClose();
    } catch {
      toast({ variant: "destructive", title: "Failed to update status." });
    }
  };

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>View Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">From:</p>
            <p>{message.name} – {message.email}</p>
          </div>

          <div>
            <p className="font-semibold">Subject:</p>
            <p>{message.subject || "No subject"}</p>
          </div>

          <div>
            <p className="font-semibold">Message:</p>
              <p className="text-start">{message.message}</p>
          </div>

          <div>
            <p className="font-semibold mb-1">Status:</p>
            <Select value={status} onValueChange={(v: ContactStatus) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>
                    <Badge variant={s === "UNREAD" ? "default" : s === "READ" ? "secondary" : "outline"}>
                      {s}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={handleSaveStatus}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
