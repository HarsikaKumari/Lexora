import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Globe, User } from 'lucide-react'
import { motion } from 'framer-motion'

const NAVIGATION_CARDS = [
  { 
    title: 'Find a Lawyer', 
    desc: 'Browse verified legal professionals by expertise.', 
    link: '/search', 
    icon: Globe, 
    color: 'bg-blue-600' 
  },
  { 
    title: 'Document Builder', 
    desc: 'Generate legally binding contracts instantly.', 
    link: '/documents', 
    icon: Zap, 
    color: 'bg-emerald-600' 
  },
  { 
    title: 'Client Dashboard', 
    desc: 'Manage your consultations and documents.', 
    link: '/dashboard', 
    icon: ShieldCheck, 
    color: 'bg-purple-600' 
  }
]

export default function Hero({ user }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-950">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-gold blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 text-center lg:text-left">
          <div className="lg:w-5/12 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-900 border border-primary-800 text-primary-300 text-sm font-semibold"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              <span>Secure Professional Ecosystem</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-serif font-bold text-white leading-[1.1]"
            >
              Excellence in <br />
              <span className="text-secondary-400 italic">Legal Tech</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-primary-100/70 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              The premium gateway for secure legal consultations and automated document management. 
              Built for modern professionals and clients worldwide.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex items-center gap-8 justify-center lg:justify-start pt-4"
            >
              <div className="flex items-center space-x-2 text-primary-400 font-bold uppercase text-[10px] tracking-[.3em]">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Partners</span>
              </div>
            </motion.div>
          </div>

          {/* Navigation Grid Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          >
            {NAVIGATION_CARDS
              .filter(card => {
                if (card.title === 'Find a Lawyer' && (user?.role === 'lawyer' || user?.role === 'admin')) return false;
                return true;
              })
              .map((card, i) => (
              <Link 
                key={i} 
                to={card.link}
                className="group relative bg-secondary-900/50 border border-white/5 p-8 rounded-3xl overflow-hidden hover:bg-secondary-900 transition-all hover:translate-y-[-4px] hover:border-white/10 shadow-2xl"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                <card.icon className="h-10 w-10 text-white mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-secondary-400 text-sm leading-relaxed mb-4">{card.desc}</p>
                <div className="flex items-center text-primary-400 text-xs font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Get Started <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="group relative bg-primary-600 p-8 rounded-3xl overflow-hidden hover:bg-primary-500 transition-all hover:translate-y-[-4px] shadow-2xl flex flex-col justify-center"
              >
                 <ShieldCheck className="h-10 w-10 text-white mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Admin Portal</h3>
                 <p className="text-primary-100 text-sm opacity-80">Global System Management & Verifications.</p>
              </Link>
            )}
            
            {/* CTA for login if not logged in */}
            {!user && (
               <Link 
                to="/auth"
                className="group relative border-2 border-dashed border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:border-white/30 transition-all"
              >
                 <User className="h-8 w-8 text-secondary-500 mb-2" />
                 <span className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Sign in to unlock all features</span>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
