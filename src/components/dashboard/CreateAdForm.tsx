'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAd } from '@/actions/ads'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

export default function CreateAdForm({ categories }: { categories: Category[] }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageCount, setImageCount] = useState(0)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await createAd(formData)
      if (result?.error) {
        toast.error('Gagal', { description: result.error })
        setIsLoading(false)
      }
    } catch (error: any) {
      toast.error('Error', { description: error.message || 'Terjadi kesalahan' })
      setIsLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-6 max-w-2xl" encType="multipart/form-data">
      <div>
        <Label htmlFor="title">Judul Iklan</Label>
        <Input id="title" name="title" required className="mt-1" placeholder="Misal: iPhone 13 Pro Max Mulus" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="categoryId">Kategori</Label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value="">Belum ada kategori (Hubungi Admin)</option>
            ) : (
              <option value="">Pilih Kategori</option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" name="price" type="number" min="0" required className="mt-1" placeholder="5000000" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi Lengkap</Label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Jelaskan kondisi barang, kelengkapan, minus (jika ada), dll."
        ></textarea>
      </div>

      <div>
        <Label htmlFor="images">Upload Gambar (Maks 10)</Label>
        <Input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          required
          className="mt-1"
          onChange={(e) => {
            const files = e.target.files
            if (files && files.length > 10) {
              alert('Maksimal 10 gambar!')
              e.target.value = ''
              setImageCount(0)
            } else {
              setImageCount(files ? files.length : 0)
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-1">{imageCount} gambar dipilih</p>
      </div>

      <Button type="submit" disabled={isLoading} className="bg-navy hover:bg-navy/90 text-white w-full sm:w-auto">
        {isLoading ? 'Menyimpan...' : 'Pasang Iklan Sekarang'}
      </Button>
    </form>
  )
}
