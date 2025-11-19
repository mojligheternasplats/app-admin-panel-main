"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { News, PaginatedResponse } from "@/lib/admin-types";
import { NewsDataTable } from "@/components/dashboard/news/data-table";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll<News>("news", { page: 1, limit: 10, sort: "publishedDate:desc" })
      .then((res: PaginatedResponse<News>) => {
        setNews(res.data);
      })
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">News</h1>
      <NewsDataTable data={news} />
    </div>
  );
}
