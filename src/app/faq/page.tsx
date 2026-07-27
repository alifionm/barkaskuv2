import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'FAQ (Tanya Jawab) - Barkasku',
  description: 'Pertanyaan yang sering diajukan mengenai Barkasku.',
}

export const revalidate = 60 // Revalidate every minute

export default async function FAQPage() {
  const supabase = await createClient()
  
  // Fetch FAQs from database
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: true })

  // Fallback if database is empty
  const defaultFaqs = [
    {
      question: 'Apa itu Barkasku?',
      answer: 'Barkasku adalah platform marketplace modern yang mempertemukan penjual dan pembeli barang bekas berkualitas secara mudah dan aman.',
    },
    {
      question: 'Apakah memasang iklan di Barkasku gratis?',
      answer: 'Ya, memasang iklan di Barkasku sepenuhnya gratis tanpa dipungut biaya apapun.',
    }
  ]

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-navy mb-8 text-center">Frequently Asked Questions (FAQ)</h1>
        
        <div className="space-y-6">
          {displayFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
