export default function Footer() {
  return (
    <footer className="bg-navy text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold mb-4">Barkasku</h3>
            <p className="text-gray-300 text-sm">
              Platform marketplace modern untuk jual beli barang bekas berkualitas.
            </p>
          </div>
          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-yellow-500">Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Barkasku. Hak cipta dilindungi undang-undang.
        </div>
      </div>
    </footer>
  )
}
