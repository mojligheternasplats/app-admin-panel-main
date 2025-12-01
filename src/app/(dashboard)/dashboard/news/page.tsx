import { api } from "@/lib/api";
import { NewsDataTable } from "@/components/dashboard/news/data-table";
import { News } from "@/lib/types";

async function getNews(): Promise<News[]> {
  try {
    const res = await api.getAll<News>("news", {
      page: 1,
      limit: 10,
      sort: "publishedDate:desc"
    });
    return res.data;
  } catch (error) {
    console.error("Failed to load news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const data = await getNews();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">News</h1>
      <NewsDataTable data={data} />
    </div>
  );
}
