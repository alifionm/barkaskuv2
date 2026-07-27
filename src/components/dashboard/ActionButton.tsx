'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ActionButtonProps {
  action: () => Promise<{ success?: string; error?: string }>
  icon: React.ReactNode
  title: string
  className?: string
  disabled?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export default function ActionButton({ action, icon, title, className, disabled, variant = 'ghost' }: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleAction() {
    setIsLoading(true)
    try {
      const result = await action()
      if (result?.error) {
        toast.error('Gagal', { description: result.error })
      } else if (result?.success) {
        toast.success('Berhasil', { description: result.success })
      }
    } catch (e: unknown) {
      toast.error('Error', { description: (e as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      title={title}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleAction}
    >
      {isLoading ? <span className="animate-pulse">...</span> : icon}
    </Button>
  )
}
