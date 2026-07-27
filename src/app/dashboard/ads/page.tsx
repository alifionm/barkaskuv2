import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye } from 'lucide-react'
import { deleteAd } from '@/actions/ads'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function UserAdsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ads: any[] = []

  if (user) {
    const { data } = await supabase
      .from('ads')
      .select(`
        id, 
        title, 
        price, 
        status, 
        created_at, 
        images,
        slug,
        categories (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      
    if (data) ads = data
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Iklan Saya</h1>
        <Link href="/dashboard/ads/create">
          <Button className="bg-navy hover:bg-navy/90 text-white">
            Pasang Iklan
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {ads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Anda belum memiliki iklan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-4">Iklan</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <Eye size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-navy line-clamp-1">{ad.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(ad.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{ad.categories?.name}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(ad.price)}</td>
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
                        {ad.status === 'approved' ? 'Aktif' : ad.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {ad.status === 'approved' && (
                          <Link href={`/ads/${ad.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="Lihat">
                              <Eye size={18} className="text-gray-500" />
                            </Button>
                          </Link>
                        )}
                        {/* Edit and Delete could be implemented next */}
                        <ActionButton
                          action={deleteAd.bind(null, ad.id)}
                          title="Hapus Iklan"
                          icon={<Trash2 size={18} />}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
