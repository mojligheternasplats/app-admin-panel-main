import { api } from '@/lib/api';
import { HeroSection } from '@/lib/types';
import { HeroDataTable } from '@/components/dashboard/hero-sections/data-table';

async function getHeroSections() {
  try {
    const response = await api.get('herosections');

    return response.data ?? []; // ✅ return only the array
  } catch (error) {
    console.error("Failed to fetch hero sections", error);
    return [];
  }
}

export default async function HeroSectionsPage() {
  const data = await getHeroSections();
  console.log(data)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Hero Sections</h1>
      </div>
      <HeroDataTable data={data} />
    </div>
  );
}
