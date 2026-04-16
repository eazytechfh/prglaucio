import { useState } from 'react'
import { useContacts } from '../hooks/useContacts'
import ContactTable from '../components/contacts/ContactTable'
import ContactForm from '../components/contacts/ContactForm'
import ContactFiltersBar from '../components/contacts/ContactFilters'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'

export default function ContactsPage() {
  const {
    contacts,
    totalUnfiltered,
    loading,
    filters,
    setFilters,
    createContact,
    deleteContact,
    isAdmin,
  } = useContacts()

  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'Todos os Contatos' : 'Meus Contatos'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {hasActiveFilters
              ? `${contacts.length} de ${totalUnfiltered} contatos`
              : `${totalUnfiltered} contato${totalUnfiltered !== 1 ? 's' : ''} cadastrado${totalUnfiltered !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters || hasActiveFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters((v) => !v)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-white/30 px-1.5 py-0.5 text-xs font-bold">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <ContactFiltersBar
          filters={filters}
          onChange={setFilters}
          showMemberFilter={isAdmin}
        />
      )}

      {/* Table */}
      <ContactTable
        contacts={contacts}
        loading={loading}
        showOwner={isAdmin}
        onDelete={deleteContact}
        onAdd={() => setShowModal(true)}
      />

      {/* Modal */}
      <Modal
        open={showModal}
        title="Novo Contato"
        onClose={() => setShowModal(false)}
      >
        <ContactForm
          onSubmit={async (data) => {
            const result = await createContact(data)
            if (!result.error) setShowModal(false)
            return result
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}
