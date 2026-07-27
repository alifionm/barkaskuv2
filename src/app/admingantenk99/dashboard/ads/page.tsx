import { createAdminClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { updateAdStatus, deleteAdAdmin } from '@/actions/admin'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function AdminAdsPage() {
  const supabase = createAdminClient()

  const { data: ads } = await supabase
    .from('ads')
    .select(`
      id, title, status, created_at, slug,
      profiles (full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Moderasi Iklan</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left block md:table">
            <thead className="hidden md:table-header-group bg-gray-50 border-b text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4">Iklan</th>
                <th className="px-6 py-4">Penjual</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {ads?.map((ad: any) => (
                <tr key={ad.id} className="border-b hover:bg-gray-50 flex flex-col md:table-row p-4 md:p-0">
                  <td className="px-2 md:px-6 py-2 md:py-4 font-medium text-gray-900 block md:table-cell">
                    <div className="md:hidden text-xs text-gray-500 font-semibold uppercase mb-1">Judul Iklan</div>
                    <Link href={`/ads/${ad.slug}`} target="_blank" className="hover:underline text-navy font-bold md:font-medium text-base md:text-sm block mb-1 md:mb-0">
                      {ad.title}
                    </Link>
                    <div className="text-xs text-gray-500 font-normal mt-1">
                      {new Date(ad.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 flex md:table-cell justify-between items-center border-t border-gray-100 md:border-0 mt-3 md:mt-0 pt-3 md:pt-4">
                    <span className="md:hidden text-sm text-gray-500 font-semibold">Penjual</span>
                    <span>{ad.profiles?.full_name}</span>
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 flex md:table-cell justify-between items-center">
                    <span className="md:hidden text-sm text-gray-500 font-semibold">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ad.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : ad.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ad.status === 'approved' ? 'Aktif' : ad.status === 'rejected' ? 'Ditolak' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-2 md:px-6 py-3 md:py-4 block md:table-cell mt-3 md:mt-0 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
                    <div className="flex justify-end md:justify-end gap-3 md:gap-2">
                      <ActionButton
                        action={updateAdStatus.bind(null, ad.id, 'approved')}
                        title="Setujui"
                        className="text-green-600 hover:text-green-700 hover:bg-green-100 bg-white md:bg-transparent border md:border-none shadow-sm md:shadow-none h-10 w-10 md:h-8 md:w-8"
                        disabled={ad.status === 'approved'}
                        icon={<CheckCircle size={20} />}
                      />
                      <ActionButton
                        action={updateAdStatus.bind(null, ad.id, 'rejected')}
                        title="Tolak"
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 bg-white md:bg-transparent border md:border-none shadow-sm md:shadow-none h-10 w-10 md:h-8 md:w-8"
                        disabled={ad.status === 'rejected'}
                        icon={<XCircle size={20} />}
                      />
                      <ActionButton
                        action={deleteAdAdmin.bind(null, ad.id)}
                        title="Hapus Permanen"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-100 bg-white md:bg-transparent border md:border-none shadow-sm md:shadow-none h-10 w-10 md:h-8 md:w-8 ml-0 md:ml-2"
                        icon={<Trash2 size={20} />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!ads || ads.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 block md:table-cell">
                    Belum ada iklan.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
