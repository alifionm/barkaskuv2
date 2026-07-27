import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch some stats
  const { count: totalAds } = await supabase.from('ads').select('*', { count: 'exact', head: true })
  const { count: pendingAds } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ringkasan Sistem</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Iklan Menunggu Review</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingAds || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Iklan</p>
          <p className="text-3xl font-bold text-navy mt-2">{totalAds || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Pengguna Aktif</p>
          <p className="text-3xl font-bold text-navy mt-2">{totalUsers || 0}</p>
        </div>
      </div>
    </div>
  )
}
