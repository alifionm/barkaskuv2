'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/actions/profile'
import { toast } from 'sonner'
import { UserCircle } from 'lucide-react'

interface ProfileFormProps {
  initialData: {
    full_name: string
    whatsapp_number: string
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await updateProfile(formData)

    if (result.error) {
      toast.error('Gagal', { description: result.error })
    } else if (result.success) {
      toast.success('Berhasil', { description: result.success })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <div className="h-20 w-20 rounded-full bg-navy/10 flex items-center justify-center text-navy shadow-inner">
          <UserCircle size={48} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informasi Pribadi</h2>
          <p className="text-sm text-gray-500 mt-1">Perbarui foto dan detail pribadi Anda di sini.</p>
        </div>
      </div>

      <form action={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-semibold">Nama Lengkap</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              defaultValue={initialData.full_name}
              className="h-11 bg-gray-50/50"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-gray-700 font-semibold">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              defaultValue={initialData.whatsapp_number}
              className="h-11 bg-gray-50/50"
              placeholder="628..."
            />
            <p className="text-xs text-gray-500">
              Gunakan format internasional (contoh: 628123...)
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-navy hover:bg-navy/90 text-white px-8 h-11 rounded-full font-medium shadow-sm transition-all active:scale-95"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
