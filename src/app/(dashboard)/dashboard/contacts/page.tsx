"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ContactMessage, ContactStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClientDate } from '@/components/dashboard/client-date';
import { ViewContactMessageDialog } from '@/components/dashboard/contacts/view-message-dialog';

const statusMap: Record<ContactStatus, string> = {
  UNREAD: 'Unread',
  READ: 'Read',
  REPLIED: 'Replied',
  ARCHIVED: 'Archived',
};

export default function ContactsPage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAll<ContactMessage>('contact');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch contact messages", error);
      }
    }
    loadData();
  }, []);

  const handleView = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setDialogOpen(true);
  };

  const handleStatusUpdate = (updated: ContactMessage) => {
    setData(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold font-headline">Contact Messages</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(item => (
                <TableRow
                  key={item.id}
                  className={item.status === 'UNREAD' ? 'bg-secondary/50' : ''}
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'UNREAD'
                          ? 'default'
                          : item.status === 'READ'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {statusMap[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ClientDate dateString={item.createdAt} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      View Message
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No messages yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/** Dialog */}
      <ViewContactMessageDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        message={selectedMsg}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
