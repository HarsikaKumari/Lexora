import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, user }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Header user={user} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
