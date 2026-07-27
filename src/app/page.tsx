import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import BannerSlider from '@/components/shared/BannerSlider'
import HeroSection from '@/components/shared/HeroSection'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: recentAds } = await supabase
    .from('ads')
    .select(`
      id, title, price, images, slug, created_at,
      profiles (full_name)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        {/* Banners Section */}
        {banners && banners.length > 0 && (
          <section className="py-8 bg-gray-50 border-b">
            <div className="container mx-auto px-4 md:px-6">
              <BannerSlider banners={banners} />
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-8 text-2xl font-bold text-navy">Kategori Pilihan</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.id}`}
                    className="flex-shrink-0 min-w-[150px] flex flex-col items-center justify-center rounded-xl border bg-white py-3 px-6 shadow-sm hover:border-navy hover:shadow-md transition-all snap-start"
                  >
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Belum ada kategori.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Ads Section */}
        <section className="py-12 bg-white border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-navy">Iklan Terbaru</h2>
              <Link href="/search" className="text-navy hover:underline font-medium">
                Lihat Semua
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recentAds && recentAds.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentAds.map((ad: any) => (
                  <Link
                    key={ad.id}
                    href={`/ads/${ad.slug}`}
                    className="group rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-navy transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-base font-bold text-navy mb-2">
                        {formatPrice(ad.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Oleh {ad.profiles?.full_name} &bull; {new Date(ad.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  Belum ada iklan terbaru.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
