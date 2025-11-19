import { api } from '@/lib/api';
import { ProgramDataTable } from '@/components/dashboard/programs/data-table';
import { Project } from '@/lib/types';

async function getPrograms(): Promise<Project[]> {
  try {
    const response = await api.getAll<Project>('projects'); // ✅ Fetch from API
    return response.data; // ✅ Extract items
  } catch (error) {
    console.error("Failed to fetch Project", error);
    return [];
  }
}

export default async function ProgramsPage() {
  const data = await getPrograms();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold font-headline">Project</h1>
      <ProgramDataTable data={data} />
    </div>
  );
}
