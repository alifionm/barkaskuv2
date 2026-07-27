import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Hubungi Kami - Barkasku',
  description: 'Punya pertanyaan atau keluhan? Hubungi tim Barkasku.',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy mb-4">Hubungi Kami</h1>
            <p className="text-gray-600">
              Silakan isi formulir di bawah ini untuk mengirim pesan kepada tim bantuan Barkasku. Kami akan membalas secepat mungkin.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama Anda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@contoh.com" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subjek</Label>
              <Input id="subject" placeholder="Perihal pesan" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Pesan</Label>
              <textarea
                id="message"
                className="w-full min-h-[150px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tulis pesan Anda di sini..."
                required
              ></textarea>
            </div>

            <Button type="button" className="w-full bg-navy text-white hover:bg-navy/90 h-12 text-lg">
              Kirim Pesan
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
