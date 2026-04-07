import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, db } from '../../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { setUserProfile, getUserProfile } from '../../firebase/services'

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [barNumber, setBarNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const authId = userCredential.user.uid
        const profile = await getUserProfile(authId)
        setUser({ uid: authId, email: userCredential.user.email, ...profile })
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Secret Admin Logic: emails starting with admin@ become admins
        const finalRole = email.toLowerCase().startsWith('admin@') ? 'admin' : role;

        const profileData = {
          email: user.email,
          role: finalRole,
          verified: finalRole === 'client' || finalRole === 'admin',
          barNumber: finalRole === 'lawyer' ? barNumber : null
        }

        await setUserProfile(user.uid, profileData)
        setUser({ uid: user.uid, ...profileData })
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  //harsika@gmail.com harsika HELL0000
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-secondary-50 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white border border-secondary-100">
          {/* Left panel: Decorative / Info */}
          <div className="hidden md:flex md:w-1/2 bg-primary-900 text-white p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <div className="absolute top-[20%] left-[-20%] w-[80%] h-[80%] bg-primary-400 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-6 italic leading-snug">Secure Your Legal <br />Future with Confidence</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <ShieldCheck className="h-6 w-6 text-primary-400 shrink-0" />
                  <p className="text-primary-200">256-bit AES encryption for all data</p>
                </div>
                <div className="flex items-start space-x-4">
                  <Briefcase className="h-6 w-6 text-primary-400 shrink-0" />
                  <p className="text-primary-200">Verified legal professionals only</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-12">
              <p className="text-sm text-primary-300">© LexiLink 2026. All rights reserved</p>
            </div>
          </div>

          {/* Right panel: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8 overflow-hidden">
              <div className="flex p-1 bg-secondary-100 rounded-xl mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-white shadow-md text-primary-600' : 'text-secondary-500'}`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-white shadow-md text-primary-600' : 'text-secondary-500'}`}
                >
                  Sign Up
                </button>
              </div>

              <h3 className="text-2xl font-serif font-bold text-secondary-950 mb-2">
                {isLogin ? 'Welcome Back' : 'Join LexiLink'}
              </h3>
              <p className="text-secondary-500 text-sm">{isLogin ? 'Enter your details to continue.' : 'Create an account to start your legal journey.'}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 italic">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setRole('client')}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'client' ? 'border-primary-600 bg-primary-50' : 'border-secondary-200'}`}
                >
                  <User className={`h-5 w-5 ${role === 'client' ? 'text-primary-600' : 'text-secondary-400'}`} />
                  <span className={`text-xs font-bold ${role === 'client' ? 'text-primary-600' : 'text-secondary-500'}`}>Client</span>
                </button>
                <button
                  onClick={() => setRole('lawyer')}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'lawyer' ? 'border-primary-600 bg-primary-50' : 'border-secondary-200'}`}
                >
                  <Briefcase className={`h-5 w-5 ${role === 'lawyer' ? 'text-primary-600' : 'text-secondary-400'}`} />
                  <span className={`text-xs font-bold ${role === 'lawyer' ? 'text-primary-600' : 'text-secondary-500'}`}>Lawyer</span>
                </button>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="password"
                    required
                    className="input-field pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {!isLogin && role === 'lawyer' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-bold text-secondary-700 mb-1 mt-4">Bar Association Number</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. BAR12345678"
                    value={barNumber}
                    onChange={(e) => setBarNumber(e.target.value)}
                  />
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full mt-8 group active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>


            <div className="mt-8 text-center">
              <p className="text-sm text-secondary-500">By continuing, you agree to our Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
