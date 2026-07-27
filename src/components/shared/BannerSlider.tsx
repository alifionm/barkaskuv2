'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Banner = {
  id: string
  image_url: string
  link?: string | null
}

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -570, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 570, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group">
      {/* Scroll Left Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-6 w-6 text-navy" />
      </Button>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-[550px] w-[550px] h-[250px] flex-shrink-0 snap-center rounded-xl overflow-hidden shadow-sm">
            {banner.link ? (
              <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img 
                  src={banner.image_url} 
                  alt="Banner" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </a>
            ) : (
              <img 
                src={banner.image_url} 
                alt="Banner" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
        onClick={scrollRight}
      >
        <ChevronRight className="h-6 w-6 text-navy" />
      </Button>
    </div>
  )
}
