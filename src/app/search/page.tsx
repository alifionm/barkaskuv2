import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'
import { Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pencarian Iklan - Barkasku',
  description: 'Cari barang bekas sesuai kebutuhan Anda di Barkasku.',
}

type Props = {
  searchParams: Promise<{
    q?: string
    category?: string
    page?: string
  }>
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  const query = searchParams?.q || ''
  const categoryId = searchParams?.category || ''
  const page = parseInt(searchParams?.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  // Fetch Categories for filter
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  // Fetch Ads with filters
  let queryBuilder = supabase
    .from('ads')
    .select(`*, profiles (full_name)`, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`)
  }

  if (categoryId) {
    queryBuilder = queryBuilder.eq('category_id', categoryId)
  }

  const { data: ads, count } = await queryBuilder
  const totalPages = count ? Math.ceil(count / limit) : 0

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

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-navy">Filter Pencarian</h2>
              
              <form action="/search" method="GET" className="space-y-4">
                {query && <input type="hidden" name="q" value={query} />}
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Kategori</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cat-all"
                        name="category"
                        value=""
                        defaultChecked={!categoryId}
                        className="h-4 w-4 text-navy focus:ring-navy border-gray-300"
                      />
                      <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600 cursor-pointer">
                        Semua Kategori
                      </label>
                    </div>
                    {categories?.map((cat) => (
                      <div key={cat.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`cat-${cat.id}`}
                          name="category"
                          value={cat.id}
                          defaultChecked={categoryId === cat.id}
                          className="h-4 w-4 text-navy focus:ring-navy border-gray-300"
                        />
                        <label htmlFor={`cat-${cat.id}`} className="ml-2 text-sm text-gray-600 cursor-pointer">
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-navy text-white hover:bg-navy/90">
                  Terapkan Filter
                </Button>

                {/* Additional filters like price could be added here */}
                
              </form>
            </div>
          </aside>

          {/* Main Results */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <form action="/search" method="GET" className="flex gap-2">
                {categoryId && <input type="hidden" name="category" value={categoryId} />}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    name="q"
                    defaultValue={query}
                    placeholder="Cari nama barang..."
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button type="submit" className="h-12 px-6 bg-navy text-white hover:bg-navy/90">
                  Cari
                </Button>
              </form>
            </div>

            <div className="mb-4 text-gray-600">
              Menampilkan {ads?.length || 0} dari {count || 0} hasil pencarian
              {query && <span> untuk &quot;<span className="font-semibold text-gray-900">{query}</span>&quot;</span>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ads && ads.length > 0 ? (
                ads.map((ad: any) => (
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
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-navy transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-lg font-bold text-navy mb-2">
                        {formatPrice(ad.price)}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        Oleh {ad.profiles?.full_name} &bull; {new Date(ad.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border shadow-sm">
                  <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Tidak ada hasil</h3>
                  <p className="text-gray-500 mt-1">Coba gunakan kata kunci lain atau hapus filter kategori.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link
                      key={i}
                      href={`/search?${new URLSearchParams({
                        ...(query && { q: query }),
                        ...(categoryId && { category: categoryId }),
                        page: (i + 1).toString(),
                      }).toString()}`}
                      className={`h-10 w-10 flex items-center justify-center rounded-md border ${
                        page === i + 1
                          ? 'bg-navy text-white border-navy'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
