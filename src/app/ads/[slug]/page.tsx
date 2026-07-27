import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { MessageCircle, MapPin, Calendar, LayoutGrid } from 'lucide-react'
import ImageGallery from '@/components/ads/ImageGallery'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient()
  const { data: ad } = await supabase
    .from('ads')
    .select('title, description, images')
    .eq('slug', params.slug)
    .single()

  if (!ad) {
    return { title: 'Iklan Tidak Ditemukan - Barkasku' }
  }

  return {
    title: `${ad.title} - Barkasku`,
    description: ad.description.substring(0, 160),
    openGraph: {
      images: ad.images && ad.images.length > 0 ? [ad.images[0]] : [],
    },
  }
}

export default async function AdDetailPage(props: Props) {
  const params = await props.params;
  const supabase = await createClient()

  const { data: ad } = await supabase
    .from('ads')
    .select(`
      *,
      profiles (full_name, whatsapp_number),
      categories (name)
    `)
    .eq('slug', params.slug)
    .single()

  if (!ad) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Format WhatsApp message
  const waNumber = ad.profiles?.whatsapp_number || ''
  const waMessage = `Halo, saya tertarik dengan iklan "${ad.title}" yang Anda pasang di Barkasku.`
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={ad.images || []} title={ad.title} />

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ad.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 border-b pb-6">
                <span className="flex items-center gap-1">
                  <LayoutGrid size={16} />
                  {ad.categories?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(ad.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              
              <h2 className="text-lg font-semibold mb-4">Deskripsi</h2>
              <div className="whitespace-pre-wrap text-gray-700">
                {ad.description}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6 shadow-sm sticky top-24">
              <p className="text-sm text-gray-500 mb-1">Harga</p>
              <p className="text-3xl font-bold text-navy mb-6">{formatPrice(ad.price)}</p>
              
              <div className="border-t pt-6 mb-6">
                <p className="text-sm text-gray-500 mb-2">Informasi Penjual</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-navy/10 text-navy flex items-center justify-center font-bold text-xl">
                    {ad.profiles?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{ad.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">Anggota Barkasku</p>
                  </div>
                </div>
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 h-12 text-lg">
                  <MessageCircle size={20} />
                  Chat Penjual via WhatsApp
                </Button>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
