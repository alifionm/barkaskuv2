'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Helper function to check if user has CMS access
async function checkAdminAccess() {
  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('admin_access')
  if (!hasAccess) {
    throw new Error('Not authorized')
  }
}

export async function createBanner(formData: FormData) {
  try {
    await checkAdminAccess()
  } catch {
    return { error: 'Not authorized' }
  }

  const link = formData.get('link') as string
  const isActive = formData.get('isActive') === 'on'
  const imageFile = formData.get('image') as File

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Gambar tidak boleh kosong' }
  }

  const fileName = `banners/${Math.random().toString(36).substring(2)}.webp`

  try {
    const arrayBuffer = await imageFile.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)
    
    // Resize to 550x250 and convert to webp
    const sharp = (await import('sharp')).default
    const webpBuffer = await sharp(imageBuffer)
      .resize({
        width: 550,
        height: 250,
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer()

    const adminSupabase = createAdminClient()
    const { error: uploadError, data } = await adminSupabase.storage
      .from('barang_images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: 'Gagal mengupload gambar.' }
    }

    if (data) {
      const { data: publicUrlData } = adminSupabase.storage
        .from('barang_images')
        .getPublicUrl(data.path)

      const imageUrl = publicUrlData.publicUrl

      const { error: insertError } = await adminSupabase.from('banners').insert({
        image_url: imageUrl,
        link: link || null,
        is_active: isActive
      })

      if (insertError) {
        return { error: insertError.message }
      }
    }

  } catch (error: unknown) {
    console.error('Error processing banner:', error)
    return { error: 'Terjadi kesalahan saat memproses gambar.' }
  }

  revalidatePath('/')
  revalidatePath('/admingantenk99/dashboard/banners')
  redirect('/admingantenk99/dashboard/banners')
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  try {
    await checkAdminAccess()
  } catch {
    return { error: 'Not authorized' }
  }

  const adminSupabase = createAdminClient()
  
  const { error } = await adminSupabase
    .from('banners')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admingantenk99/dashboard/banners')
  return { success: 'Status banner berhasil diubah' }
}

export async function deleteBanner(id: string) {
  try {
    await checkAdminAccess()
  } catch {
    return { error: 'Not authorized' }
  }

  const adminSupabase = createAdminClient()

  // Find banner image url to delete it from storage first
  const { data: banner } = await adminSupabase
    .from('banners')
    .select('image_url')
    .eq('id', id)
    .single()

  if (banner && banner.image_url) {
    // Extract filename from public url
    const urlParts = banner.image_url.split('/')
    const pathIndex = urlParts.indexOf('barang_images')
    if (pathIndex !== -1) {
      const fileName = urlParts.slice(pathIndex + 1).join('/')
      await adminSupabase.storage.from('barang_images').remove([fileName])
    }
  }

  const { error } = await adminSupabase.from('banners').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admingantenk99/dashboard/banners')
  return { success: 'Banner berhasil dihapus' }
}
