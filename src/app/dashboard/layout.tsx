import Link from 'next/link'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, User, List, PlusCircle, LogOut } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Dashboard Menu Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <LayoutDashboard size={18} />
                  <span>Ringkasan</span>
                </Link>
                <Link
                  href="/dashboard/ads"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <List size={18} />
                  <span>Iklan Saya</span>
                </Link>
                <Link
                  href="/dashboard/ads/create"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>Pasang Iklan</span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <User size={18} />
                  <span>Profil & Pengaturan</span>
                </Link>
              </nav>
              <div className="mt-6 border-t pt-4">
                <form action={logout}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut size={18} />
                    <span>Keluar Akun</span>
                  </Button>
                </form>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
