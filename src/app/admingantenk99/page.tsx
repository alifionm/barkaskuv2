'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { loginCms } from '@/actions/cms'

export default function CmsLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await loginCms(formData)
    
    if (result.error) {
      toast.error('Gagal Masuk', { description: result.error })
      setIsLoading(false)
    } else {
      toast.success('Berhasil', { description: 'Mengalihkan ke dashboard...' })
      // Next.js redirect doesn't always work seamlessly with client-side forms + action, so we push manually if needed, 
      // but Server Action `redirect` might throw, which is normal.
      router.push('/admingantenk99/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-800">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            Secret CMS
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                placeholder="admin"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              {isLoading ? 'Processing...' : 'Access CMS'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
