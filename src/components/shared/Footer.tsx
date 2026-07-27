const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-8">
          
          <div className="flex flex-col items-center md:items-start max-w-sm">
            <img 
              src="/logo.png" 
              alt="Barkasku Logo" 
              className="h-16 mb-4 object-contain" 
            />
            <p className="text-gray-300 text-sm text-center md:text-left leading-relaxed">
              Platform marketplace modern untuk jual beli barang bekas berkualitas. Temukan penawaran terbaik dan terpercaya hanya di Barkasku.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-bold mb-4 text-yellow-500 tracking-wide">Bantuan</h4>
            <ul className="space-y-3 text-sm text-gray-300 text-center md:text-left">
              <li><a href="/faq" className="hover:text-yellow-400 transition-colors">Pertanyaan Umum (FAQ)</a></li>
              <li><a href="/contact" className="hover:text-yellow-400 transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-bold mb-4 text-yellow-500 tracking-wide">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/infobarkas_jogjaa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-yellow-500 hover:text-navy transition-all duration-300 transform hover:scale-110"
              >
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Barkasku. Hak cipta dilindungi undang-undang.
        </div>
      </div>
    </footer>
  )
}
