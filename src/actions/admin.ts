'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAdStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = createAdminClient()
  const { error } = await supabase.from('ads').update({ status }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admingantenk99/dashboard/ads')
  revalidatePath('/admingantenk99/dashboard')
  revalidatePath('/')
  return { success: 'Status iklan berhasil diperbarui' }
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const supabase = createAdminClient()

  const { error } = await supabase.from('categories').insert({ name, slug })
  if (error) return { error: error.message }
  
  revalidatePath('/admingantenk99/dashboard/categories')
  return { success: 'Kategori berhasil ditambahkan' }
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admingantenk99/dashboard/categories')
  return { success: 'Kategori berhasil dihapus' }
}

export async function createFaq(formData: FormData) {
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const supabase = createAdminClient()

  const { error } = await supabase.from('faqs').insert({ question, answer })
  if (error) return { error: error.message }
  
  revalidatePath('/admingantenk99/dashboard/faq')
  revalidatePath('/faq')
  return { success: 'FAQ berhasil ditambahkan' }
}

export async function deleteFaq(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admingantenk99/dashboard/faq')
  revalidatePath('/faq')
  return { success: 'FAQ berhasil dihapus' }
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient()
  
  // Try to delete from auth.users (will cascade to profiles if FK is setup with cascade, 
  // otherwise we delete profile first. Let's delete auth user which requires admin api).
  const { error } = await supabase.auth.admin.deleteUser(id)
  
  if (error) {
    // fallback: if auth admin deletion fails, try deleting profile directly 
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', id)
    if (profileError) return { error: profileError.message }
  }
  
  revalidatePath('/admingantenk99/dashboard/users')
  return { success: 'Pengguna berhasil dihapus' }
}
