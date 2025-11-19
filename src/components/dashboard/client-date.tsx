'use client';

import { useEffect, useState } from 'react';

interface ClientDateProps {
  dateString: string;
}

export function ClientDate({ dateString }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date(dateString);
    setFormattedDate(date.toLocaleDateString(undefined, { // Use browser default locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [dateString]);

  if (!formattedDate) {
    // You can return a placeholder or null while waiting for client-side render
    return null;
  }

  return <span>{formattedDate}</span>;
}
