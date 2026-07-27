import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-navy">Barkasku</span>
        </Link>
        <div className="flex items-center gap-4 flex-1 justify-end">
          {user ? (
            <>
              {/* Search Bar when Logged In */}
              <form action="/search" method="GET" className="hidden md:flex relative max-w-sm w-full mx-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  name="q"
                  placeholder="Cari barang..."
                  className="pl-9 h-10 w-full bg-gray-50 border-gray-200 focus-visible:ring-navy"
                />
              </form>
              <Link href="/dashboard" title="Profil Dashboard">
                <Button variant="ghost" size="icon" className="text-navy hover:bg-navy/10 rounded-full h-10 w-10">
                  <User size={20} />
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Buttons when Not Logged In */}
              <Link href="/login">
                <Button variant="ghost" className="text-navy hover:bg-navy/10 font-medium">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-navy hover:bg-navy/90 text-white font-medium shadow-sm">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
