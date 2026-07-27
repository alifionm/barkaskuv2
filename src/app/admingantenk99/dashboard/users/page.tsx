import { createAdminClient } from '@/lib/supabase/server'
import { deleteUser } from '@/actions/admin'
import { Trash2 } from 'lucide-react'
import ActionButton from '@/components/dashboard/ActionButton'

export default async function AdminUsersPage() {
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Manajemen Pengguna</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Terdaftar Pada</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {u.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{u.full_name}</td>
                  <td className="px-6 py-4">{u.whatsapp_number}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionButton
                      action={deleteUser.bind(null, u.id)}
                      title="Hapus Pengguna"
                      icon={<Trash2 size={16} />}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    />
                  </td>
                </tr>
              ))}
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Belum ada pengguna.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
