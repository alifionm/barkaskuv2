'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBanner } from '@/actions/banners'
import { toast } from 'sonner'

export default function CreateBannerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [imageCount, setImageCount] = useState(0)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await createBanner(formData)
      if (result?.error) {
        toast.error('Gagal', { description: result.error })
        setIsLoading(false)
      } else {
        toast.success('Berhasil', { description: 'Banner berhasil diunggah' })
        // Optional: clear form or handled by redirect
      }
    } catch (error: any) {
      toast.error('Error', { description: error.message || 'Terjadi kesalahan' })
      setIsLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-6 max-w-xl" encType="multipart/form-data">
      <div>
        <Label htmlFor="image">Upload Banner (Otomatis WebP 550x250)</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          className="mt-1"
          onChange={(e) => {
            const files = e.target.files
            setImageCount(files ? files.length : 0)
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          {imageCount > 0 ? '1 gambar dipilih' : 'Pilih 1 gambar'}
        </p>
      </div>

      <div>
        <Label htmlFor="link">Tautan / Link (Opsional)</Label>
        <Input 
          id="link" 
          name="link" 
          type="url" 
          className="mt-1" 
          placeholder="https://example.com" 
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          defaultChecked
          className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
        />
        <Label htmlFor="isActive">Langsung Aktifkan Banner</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="bg-navy hover:bg-navy/90 text-white w-full sm:w-auto">
        {isLoading ? 'Mengunggah...' : 'Upload Banner'}
      </Button>
    </form>
  )
}
