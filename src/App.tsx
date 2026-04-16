import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import ContactsPage from './pages/ContactsPage'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-200">404</p>
        <p className="mt-2 text-slate-600">Página não encontrada</p>
        <a href="/" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          Voltar ao início
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/contacts" replace />} />
              <Route path="/contacts" element={<ContactsPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/members" element={<MembersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
