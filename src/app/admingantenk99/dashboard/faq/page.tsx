import { createAdminClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFaq, deleteFaq } from '@/actions/admin'
import { Trash2 } from 'lucide-react'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function AdminFAQPage() {
  const supabase = createAdminClient()

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Kelola FAQ</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Add FAQ */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Tambah FAQ</h3>
            {/* @ts-expect-error Server Action return types mismatch in React 19 */}
            <form action={createFaq} className="space-y-4">
              <div>
                <label htmlFor="question" className="text-sm font-medium text-gray-700">Pertanyaan</label>
                <Input id="question" name="question" required className="mt-1" placeholder="Misal: Apa itu Barkasku?" />
              </div>
              <div>
                <label htmlFor="answer" className="text-sm font-medium text-gray-700">Jawaban</label>
                <textarea
                  id="answer"
                  name="answer"
                  required
                  className="mt-1 w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Isi jawaban di sini..."
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white">
                Simpan
              </Button>
            </form>
          </div>
        </div>

        {/* List FAQs */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden p-6 space-y-4">
            {faqs?.map((faq) => (
              <div key={faq.id} className="border rounded-lg p-4 relative group">
                <h4 className="font-bold text-gray-900 pr-10">{faq.question}</h4>
                <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton
                    action={deleteFaq.bind(null, faq.id)}
                    title="Hapus FAQ"
                    icon={<Trash2 size={16} />}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              </div>
            ))}
            {!faqs || faqs.length === 0 ? (
              <div className="py-8 text-center text-gray-500 border rounded-lg">
                Belum ada FAQ.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
