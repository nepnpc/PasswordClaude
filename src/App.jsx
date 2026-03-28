import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CryptoProvider } from './context/CryptoContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Blog from './pages/Blog'
import Vault from './pages/Vault'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ChangeMasterPassword from './pages/ChangeMasterPassword'
import AdminIndex from './pages/admin/AdminIndex'
import PostEditor from './pages/admin/PostEditor'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CryptoProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <Vault />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-master-password"
            element={
              <ProtectedRoute>
                <ChangeMasterPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminIndex />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/post/new"
            element={
              <AdminRoute>
                <PostEditor />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/post/:id"
            element={
              <AdminRoute>
                <PostEditor />
              </AdminRoute>
            }
          />
        </Routes>
        </CryptoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
