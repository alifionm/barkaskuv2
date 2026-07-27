'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
import { redirect } from 'next/navigation'

export async function createBanner(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
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
      const { data: publicUrlData } = supabase.storage
        .from('barang_images')
        .getPublicUrl(data.path)

      const imageUrl = publicUrlData.publicUrl

      const { error: insertError } = await supabase.from('banners').insert({
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
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
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
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('banners').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admingantenk99/dashboard/banners')
  return { success: 'Banner berhasil dihapus' }
}
