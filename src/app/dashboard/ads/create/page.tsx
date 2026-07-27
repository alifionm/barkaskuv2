import { createClient } from '@/lib/supabase/server'
import CreateAdForm from '@/components/dashboard/CreateAdForm'

export default async function CreateAdPage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Pasang Iklan Baru</h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <CreateAdForm categories={categories || []} />
      </div>
    </div>
  )
}
