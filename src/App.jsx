import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import Hero from './components/home/Hero'
import Features from './components/home/Features'
import AuthPage from './features/auth/AuthPage'
import Dashboard from './features/dashboard/Dashboard'
import LawyerListing from './features/discovery/LawyerListing'
import DocumentBuilder from './features/documents/DocumentBuilder'
import ConsultationRoom from './features/consultation/ConsultationRoom'
import AdminDashboard from './features/admin/AdminDashboard'

import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from './firebase/services'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Restore session from Firestore
        try {
          const profile = await getUserProfile(authUser.uid)
          setUser({ ...authUser, ...profile })
        } catch (error) {
          console.error("Error restoring session:", error)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Features />
          </>
        } />
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/search" element={<LawyerListing user={user} />} />
        <Route path="/documents" element={<DocumentBuilder user={user} />} />
        <Route path="/consultation/:id" element={<ConsultationRoom user={user} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
      </Routes>
    </Layout>
  )
}

export default App
