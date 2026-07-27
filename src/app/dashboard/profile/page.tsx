import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialData = { full_name: '', whatsapp_number: '' }

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, whatsapp_number')
      .eq('id', user.id)
      .single()

    if (data) {
      initialData = data
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Pengaturan Profil</h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  )
}
