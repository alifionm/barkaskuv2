'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/actions/auth'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await login(formData)
      if (result?.error) {
        toast.error('Login Gagal', { description: result.error })
      }
    } catch (error: unknown) {
      toast.error('Terjadi Kesalahan', { description: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-navy">
            Masuk ke Barkasku
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Atau{' '}
            <Link
              href="/register"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              daftar akun baru
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center bg-navy hover:bg-navy/90 text-white"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
