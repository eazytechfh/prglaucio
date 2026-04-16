import { useState } from 'react'
import type { Contact } from '../../types'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Spinner from '../ui/Spinner'

interface ContactTableProps {
  contacts: Contact[]
  loading: boolean
  showOwner?: boolean
  onDelete: (id: string) => Promise<{ error: string | null }>
  onAdd: () => void
}

export default function ContactTable({
  contacts,
  loading,
  showOwner = false,
  onDelete,
  onAdd,
}: ContactTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este contato?')) return
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        title="Nenhum contato cadastrado"
        description="Adicione seu primeiro contato clicando no botão abaixo."
        action={
          <Button onClick={onAdd}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Contato
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bairro</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Igreja</th>
            {showOwner && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Membro</th>
            )}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {contacts.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.nome}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.telefone}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.bairro}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.igreja}</td>
              {showOwner && (
                <td className="px-4 py-3 text-sm text-slate-600">
                  {c.profiles?.name ?? '—'}
                </td>
              )}
              <td className="px-4 py-3 text-sm text-slate-500">
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="danger"
                  size="sm"
                  loading={deletingId === c.id}
                  onClick={() => handleDelete(c.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
