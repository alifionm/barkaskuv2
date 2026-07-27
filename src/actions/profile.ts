'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const whatsapp = formData.get('whatsapp') as string

  if (!whatsapp.startsWith('62')) {
    return { error: 'Nomor WhatsApp harus diawali dengan 62.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, whatsapp_number: whatsapp })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard')
  
  return { success: 'Profil berhasil diperbarui.' }
}
