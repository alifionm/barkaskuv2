'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const whatsapp = formData.get('whatsapp') as string

  if (!whatsapp.startsWith('62')) {
    return { error: 'Nomor WhatsApp harus diawali dengan 62.' }
  }

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  // Sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        whatsapp_number: whatsapp,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
