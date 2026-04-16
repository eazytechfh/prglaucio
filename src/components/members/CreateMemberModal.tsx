import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface CreateMemberModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string, email: string, password: string) => Promise<{ error: string | null }>
}

export default function CreateMemberModal({ open, onClose, onCreate }: CreateMemberModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Preencha todos os campos. A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await onCreate(name, email, password)
    if (error) {
      setError(error)
    } else {
      handleClose()
    }
    setLoading(false)
  }

  return (
    <Modal
      open={open}
      title="Cadastrar Novo Membro"
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button form="create-member-form" type="submit" loading={loading}>
            Cadastrar
          </Button>
        </>
      }
    >
      <form id="create-member-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Ex: Maria Oliveira"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="membro@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha inicial"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </Modal>
  )
}
