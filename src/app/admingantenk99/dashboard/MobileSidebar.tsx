"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Users, Grid, List, CheckSquare, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/admingantenk99/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admingantenk99/dashboard/banners", label: "Banner Iklan", icon: ImageIcon },
    { href: "/admingantenk99/dashboard/ads", label: "Moderasi Iklan", icon: CheckSquare },
    { href: "/admingantenk99/dashboard/categories", label: "Kategori", icon: Grid },
    { href: "/admingantenk99/dashboard/faq", label: "FAQ", icon: List },
    { href: "/admingantenk99/dashboard/users", label: "Pengguna", icon: Users },
  ]

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <aside className="relative w-64 bg-navy text-white flex flex-col h-full overflow-y-auto">
            <div className="flex h-16 items-center justify-between px-6 bg-black/10">
              <Link href="/admingantenk99/dashboard" className="text-xl font-bold" onClick={() => setIsOpen(false)}>
                Admin Barkasku
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-6">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
