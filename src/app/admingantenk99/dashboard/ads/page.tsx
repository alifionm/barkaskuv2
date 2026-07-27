import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { updateAdStatus } from '@/actions/admin'
import { deleteAd } from '@/actions/ads'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function AdminAdsPage() {
  const supabase = await createClient()

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
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4">Iklan</th>
                <th className="px-6 py-4">Penjual</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {ads?.map((ad: any) => (
                <tr key={ad.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link href={`/ads/${ad.slug}`} target="_blank" className="hover:underline text-navy">
                      {ad.title}
                    </Link>
                    <div className="text-xs text-gray-500 font-normal mt-1">
                      {new Date(ad.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">{ad.profiles?.full_name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        action={updateAdStatus.bind(null, ad.id, 'approved')}
                        title="Setujui"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        disabled={ad.status === 'approved'}
                        icon={<CheckCircle size={18} />}
                      />
                      <ActionButton
                        action={updateAdStatus.bind(null, ad.id, 'rejected')}
                        title="Tolak"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={ad.status === 'rejected'}
                        icon={<XCircle size={18} />}
                      />
                      <ActionButton
                        action={deleteAd.bind(null, ad.id)}
                        title="Hapus Permanen"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 ml-2"
                        icon={<Trash2 size={18} />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!ads || ads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
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
