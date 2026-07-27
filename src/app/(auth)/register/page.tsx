'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/actions/auth'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await register(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(result.success)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-navy">
            Daftar Akun Barkasku
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
            {success}
          </div>
        ) : (
          <form className="mt-8 space-y-6" action={onSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Budi Santoso"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  className="mt-1"
                  placeholder="6281234567890"
                />
                <p className="text-xs text-gray-500 mt-1">Harus diawali dengan 62</p>
              </div>
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
                  required
                  className="mt-1"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center bg-navy hover:bg-navy/90 text-white"
              >
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
