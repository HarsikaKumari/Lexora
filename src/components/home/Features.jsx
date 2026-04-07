import { Video, FileText, Lock, Users, Calendar, Globe } from 'lucide-react'

const features = [
  {
    title: 'Expert Consultation',
    description: 'Secure, high-definition video and audio calls with legal professionals globally.',
    icon: Video,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Document Automation',
    description: 'Smart form-based document builder. Fill in the blanks and generate instant PDFs.',
    icon: FileText,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'End-to-End Encryption',
    description: 'Your privacy is our priority. All communications and documents are encrypted.',
    icon: Lock,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Lawyer Matching',
    description: 'AI-powered matching to help you find the best professional for your case.',
    icon: Users,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Scheduling',
    description: 'Integrated calendar with timezone support for seamless appointment booking.',
    icon: Calendar,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Multi-Language Support',
    description: 'Accessible in multiple languages to overcome linguistic barriers in legal services.',
    icon: Globe,
    color: 'bg-indigo-50 text-indigo-600',
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-secondary-950 mb-4 tracking-tight leading-tight">Everything You Need for Legal Success</h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            From instant consultations to automated documents, LexiLink provides a comprehensive suite of tools to manage your legal needs efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group p-8 flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl ${feature.color} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-secondary-950">{feature.title}</h3>
              <p className="text-secondary-600 group-hover:text-secondary-800 transition-colors leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
