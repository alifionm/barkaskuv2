'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginCms(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (username === 'admin' && password === 'admingantenk99') {
    const cookieStore = await cookies()
    cookieStore.set('admin_access', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })
    
    return { success: true }
  }

  return { error: 'Username atau password salah' }
}

export async function logoutCms() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_access')
  redirect('/admingantenk99')
}
