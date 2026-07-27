import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user profile
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName = 'Pengguna'
  let totalAds = 0
  let pendingAds = 0
  let approvedAds = 0

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    if (profile) fullName = profile.full_name

    // Get ads statistics
    const { data: ads } = await supabase
      .from('ads')
      .select('status')
      .eq('user_id', user.id)

    if (ads) {
      totalAds = ads.length
      pendingAds = ads.filter((ad) => ad.status === 'pending').length
      approvedAds = ads.filter((ad) => ad.status === 'approved').length
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">
        Selamat datang, {fullName}!
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Iklan Saya</p>
          <p className="mt-2 text-3xl font-bold text-navy">{totalAds}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Iklan Aktif</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{approvedAds}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Menunggu Persetujuan</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingAds}</p>
        </div>
      </div>
    </div>
  )
}
