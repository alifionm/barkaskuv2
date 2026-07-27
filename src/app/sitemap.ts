import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barkasku.vercel.app'
  
  const supabase = await createClient()

  // Get all active ads
  const { data: ads } = await supabase
    .from('ads')
    .select('slug, updated_at')
    .eq('status', 'approved')

  const adUrls = (ads || []).map((ad) => ({
    url: `${baseUrl}/ads/${ad.slug}`,
    lastModified: new Date(ad.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...adUrls,
  ]
}
