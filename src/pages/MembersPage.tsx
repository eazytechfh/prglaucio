import { useState } from 'react'
import { useMembers } from '../hooks/useMembers'
import CreateMemberModal from '../components/members/CreateMemberModal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function MembersPage() {
  const { members, loading, createMember, deleteMember } = useMembers()
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o membro "${name}"? Todos os contatos cadastrados por ele também serão excluídos.`)) return
    setDeletingId(id)
    await deleteMember(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Membros</h1>
          <p className="mt-1 text-sm text-slate-500">
            {members.length} membro{members.length !== 1 ? 's' : ''} cadastrado{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Membro
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          title="Nenhum membro cadastrado"
          description="Adicione membros para que possam acessar o sistema."
          action={<Button onClick={() => setShowModal(true)}>Novo Membro</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">E-mail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Perfil</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Membro desde</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{m.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="green">Membro</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(m.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === m.id}
                      onClick={() => handleDelete(m.id, m.name)}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateMemberModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={createMember}
      />
    </div>
  )
}
