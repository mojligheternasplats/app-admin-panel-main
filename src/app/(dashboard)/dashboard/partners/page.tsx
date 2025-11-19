import { api } from '@/lib/api';
import { PartnerDataTable } from '@/components/dashboard/partners/data-table';
import { Partner } from '@/lib/types';

async function getPartners(): Promise<Partner[]> {
  try {
    const response = await api.getAll<Partner>('partners'); // ✅ Fetch from API
    console.log(response.data)
    return response.data; // ✅ Extract items from PaginatedResponse
  } catch (error) {
    console.error("Failed to fetch partners", error);
    return [];
  }
}

export default async function PartnersPage() {
  const data = await getPartners();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold font-headline">Partners</h1>
      <PartnerDataTable data={data} />
    </div>
  );
}
