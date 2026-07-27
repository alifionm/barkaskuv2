'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'

export async function createAd(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceStr = formData.get('price') as string
    const categoryId = formData.get('categoryId') as string
    const imageFiles = formData.getAll('images') as File[]

    const price = parseFloat(priceStr)
    if (isNaN(price) || price < 0) {
      return { error: 'Harga tidak valid' }
    }

    if (imageFiles.length > 10) {
      return { error: 'Maksimal 10 gambar diperbolehkan' }
    }

    // Generate unique slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`

    // Upload images
    const imageUrls: string[] = []
    
    for (const file of imageFiles) {
      // In Next.js FormData, empty files might be passed as empty string or size 0
      if (!file || typeof file === 'string' || file.size === 0) continue

      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.webp`
      
      // Auto-convert image to WebP format for optimization
      const arrayBuffer = await file.arrayBuffer()
      const imageBuffer = Buffer.from(arrayBuffer)
      
      const webpBuffer = await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toBuffer()

      // We use the admin client to bypass RLS policies in case the user hasn't set them up yet for the new bucket
      const adminSupabase = createAdminClient()
      const { error: uploadError, data } = await adminSupabase.storage
        .from('barang_images')
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { error: 'Gagal mengupload gambar. Pastikan format gambar didukung.' }
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('barang_images')
          .getPublicUrl(data.path)
        
        imageUrls.push(publicUrlData.publicUrl)
      }
    }

    if (imageUrls.length === 0) {
      return { error: 'Minimal harus ada 1 gambar yang diupload.' }
    }

    // Insert Ad
    const { error: insertError } = await supabase.from('ads').insert({
      title,
      slug,
      description,
      price,
      category_id: categoryId,
      user_id: user.id,
      images: imageUrls,
      status: 'pending',
    })

    if (insertError) {
      return { error: insertError.message }
    }
  } catch (error: any) {
    console.error("Error inside createAd:", error)
    return { error: error.message || 'Terjadi kesalahan sistem saat memproses permintaan.' }
  }

  // Redirect outside of try-catch so NEXT_REDIRECT error doesn't get caught
  revalidatePath('/dashboard/ads')
  redirect('/dashboard/ads')
}

export async function deleteAd(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('ads').delete().eq('id', id)

    if (error) {
      return { error: error.message }
    }
  } catch (error: any) {
    return { error: error.message || 'Gagal menghapus iklan.' }
  }

  revalidatePath('/dashboard/ads')
  return { success: 'Iklan berhasil dihapus' }
}
