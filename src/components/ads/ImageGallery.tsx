'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 relative mb-4">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-lg">Tidak ada gambar</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      {/* Main Large Image */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 relative mb-4">
        <img
          src={images[selectedIndex]}
          alt={`${title} - Gambar ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${
                selectedIndex === idx ? 'border-navy scale-95 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
