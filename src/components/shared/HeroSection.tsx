'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const IMAGES = ['/hero_img.webp', '/hero_img_2.webp']

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      className="bg-navy text-white relative flex items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] overflow-hidden"
    >
      {/* Background Images */}
      {IMAGES.map((img, index) => (
        <div 
          key={img}
          className={`absolute inset-0 bg-contain bg-no-repeat bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="absolute inset-0 bg-navy/80 z-0"></div>
      
      <div className="container mx-auto px-4 text-center md:px-6 relative z-10 py-12 pointer-events-none">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Temukan Barang Bekas Impianmu
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300 mb-8">
          Jual beli barang bekas berkualitas menjadi lebih mudah, cepat, dan aman di Barkasku.
        </p>
        <div className="flex justify-center gap-4 pointer-events-auto">
          <Link
            href="/search"
            className="rounded-md bg-yellow-500 px-6 py-3 font-medium text-white shadow hover:bg-yellow-600 transition-colors"
          >
            Cari Barang
          </Link>
          <Link
            href="/dashboard/ads/create"
            className="rounded-md bg-white px-6 py-3 font-medium text-navy shadow hover:bg-gray-100 transition-colors"
          >
            Pasang Iklan
          </Link>
        </div>
      </div>
    </section>
  )
}
