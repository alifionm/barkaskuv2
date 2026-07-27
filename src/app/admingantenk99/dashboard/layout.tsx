import Link from 'next/link'
import { logoutCms } from '@/actions/cms'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, Grid, List, LogOut, CheckSquare, Image as ImageIcon } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-col bg-navy text-white hidden md:flex">
        <div className="flex h-16 items-center px-6 bg-black/10">
          <Link href="/admingantenk99/dashboard" className="text-xl font-bold">
            Admin Barkasku
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          <Link
            href="/admingantenk99/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admingantenk99/dashboard/banners"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <ImageIcon size={20} />
            <span>Banner Iklan</span>
          </Link>
          <Link
            href="/admingantenk99/dashboard/ads"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <CheckSquare size={20} />
            <span>Moderasi Iklan</span>
          </Link>
          <Link
            href="/admingantenk99/dashboard/categories"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <Grid size={20} />
            <span>Kategori</span>
          </Link>
          <Link
            href="/admingantenk99/dashboard/faq"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <List size={20} />
            <span>FAQ</span>
          </Link>
          <Link
            href="/admingantenk99/dashboard/users"
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
          >
            <Users size={20} />
            <span>Pengguna</span>
          </Link>
        </nav>
        <div className="p-4 bg-black/10">
          <form action={logoutCms}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-red-300 hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Administrator Panel</h1>
          <Link href="/">
            <Button variant="outline" size="sm">Lihat Website</Button>
          </Link>
        </header>

        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  )
}
