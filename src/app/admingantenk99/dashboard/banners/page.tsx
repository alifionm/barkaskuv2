import { createAdminClient } from '@/lib/supabase/server'
import CreateBannerForm from '@/components/dashboard/CreateBannerForm'
import { Button } from '@/components/ui/button'
import { toggleBannerStatus, deleteBanner } from '@/actions/banners'

export default async function AdminBannersPage() {
  const supabase = createAdminClient()

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Banner Iklan</h1>
      
      <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tambah Banner Baru</h2>
        <CreateBannerForm />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Daftar Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners && banners.length > 0 ? (
            banners.map((banner) => (
              <div key={banner.id} className="border rounded-lg overflow-hidden flex flex-col shadow-sm">
                <div className="relative h-32 bg-gray-100">
                  <img 
                    src={banner.image_url} 
                    alt="Banner" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {banner.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm text-gray-600 mb-2 truncate" title={banner.link || 'Tidak ada link'}>
                    Link: {banner.link || '-'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Diunggah: {new Date(banner.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <div className="mt-auto flex justify-between gap-2">
                    <form action={async () => {
                      'use server'
                      await toggleBannerStatus(banner.id, banner.is_active)
                    }}>
                      <Button variant="outline" size="sm" type="submit">
                        {banner.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </form>
                    
                    <form action={async () => {
                      'use server'
                      await deleteBanner(banner.id)
                    }}>
                      <Button variant="destructive" size="sm" type="submit">
                        Hapus
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada banner.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
