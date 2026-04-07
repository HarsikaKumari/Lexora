import { Link } from 'react-router-dom'
import { Scale, Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Scale className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-serif font-bold tracking-tight">LexiLink</span>
            </Link>
            <p className="text-secondary-400 max-w-sm leading-relaxed">
              Empowering individuals and businesses with accessible, high-quality legal consultation and document automation services.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-secondary-400">
              <li><Link to="/search" className="hover:text-primary-400 transition-colors">Find a Lawyer</Link></li>
              <li><Link to="/documents" className="hover:text-primary-400 transition-colors">Legal Documents</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-secondary-400">
              <li><Link to="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-secondary-500 text-sm">
            © {new Date().getFullYear()} LexiLink. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-secondary-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-secondary-500 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="text-secondary-500 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
