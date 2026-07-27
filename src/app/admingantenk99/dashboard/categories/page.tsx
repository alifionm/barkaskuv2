import { createAdminClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCategory, deleteCategory } from '@/actions/admin'
import { Trash2 } from 'lucide-react'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Kelola Kategori</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Add Category */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Tambah Kategori</h3>
            {/* @ts-expect-error Server Action return types mismatch in React 19 */}
            <form action={createCategory} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Kategori</label>
                <Input id="name" name="name" required className="mt-1" placeholder="Misal: Elektronik" />
              </div>
              <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white">
                Simpan
              </Button>
            </form>
          </div>
        </div>

        {/* List Categories */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <ActionButton
                          action={deleteCategory.bind(null, cat.id)}
                          title="Hapus Kategori"
                          icon={<Trash2 size={16} />}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {!categories || categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Belum ada kategori.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
