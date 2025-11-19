
import { api } from '@/lib/api';
import { YouthTestimonial } from '@/lib/types';
import { TestimonialDataTable } from '@/components/dashboard/testimonials/data-table';


async function getTestimonials(): Promise<YouthTestimonial[]> {
  try {
    const response = await api.getAll<YouthTestimonial>('testimonials'); // ✅ use getAll
    return response; // ✅ extract items from PaginatedResponse
  } catch (error) {
    console.error("Failed to fetch events", error);
    return [];
  }
}

export default async function TestimonialsPage() {
  const data = await getTestimonials();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Youth Testimonials</h1>
      </div>
      <TestimonialDataTable data={data} />
    </div>
  );
}
