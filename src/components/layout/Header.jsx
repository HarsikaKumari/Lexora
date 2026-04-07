import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Scale, LogIn, Menu, X, User, LogOut } from 'lucide-react'
import { auth } from '../../firebase/config'
import { signOut } from 'firebase/auth'

export default function Header({ user }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/' // Direct redirect to clear states
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="fixed w-full z-50 glass shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group" onClick={() => setIsOpen(false)}>
              <Scale className="h-8 w-8 text-primary-600 transition-transform group-hover:rotate-12" />
              <span className="text-2xl font-serif font-bold text-secondary-950 tracking-tight">LexiLink</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {(!user || user.role === 'client') && (
              <Link to="/search" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm">Find Lawyer</Link>
            )}
            <Link to="/documents" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm">Documents</Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center space-x-2 text-primary-600 font-semibold bg-primary-50 px-4 py-2 rounded-full border border-primary-100 hover:bg-primary-100 transition-all text-sm">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm">Admin</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-secondary-500 hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-widest pl-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary !py-2 shadow-none hover:shadow-md text-sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-secondary-100 slide-in">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {(!user || user.role === 'client') && (
              <Link to="/search" className="block px-3 py-2 text-secondary-600 font-medium h-full" onClick={() => setIsOpen(false)}>Find Lawyer</Link>
            )}
            <Link to="/documents" className="block px-3 py-2 text-secondary-600 font-medium h-full" onClick={() => setIsOpen(false)}>Documents</Link>
            {user ? (
              <Link to="/dashboard" className="block px-3 py-2 text-primary-600 font-semibold">Dashboard</Link>
            ) : (
              <Link to="/auth" className="block px-3 py-2 btn btn-primary text-center">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
