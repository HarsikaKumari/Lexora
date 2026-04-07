import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MessageSquare, FileText, Clock, ChevronRight, User, Video, Download } from 'lucide-react'
import { getBookings, getDocuments } from '../../firebase/services'

export default function Dashboard({ user }) {
  const [bookings, setBookings] = useState([])
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      setLoading(true)
      try {
        const [bookingsData, docsData] = await Promise.all([
          getBookings(user.uid, user.role),
          getDocuments(user.uid)
        ])
        setBookings(bookingsData)
        setDocs(docsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleDownload = (docData) => {
    const content = `LECILINK LEGAL DOCUMENT\n\nName: ${docData.name}\nCategory: ${docData.category}\nParty A: ${docData.partyA}\nParty B: ${docData.partyB}\nGenerated: ${new Date(docData.createdAt?.toDate()).toLocaleString()}\n\nNote: This is a metadata summary of your generated document.`;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${docData.name}_details.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const stats = [
    { label: 'Consultations', value: bookings.length.toString(), icon: Video, color: 'text-blue-600' },
    { label: 'Documents', value: docs.length.toString(), icon: FileText, color: 'text-emerald-600' },
    { label: 'Unread Messages', value: '0', icon: MessageSquare, color: 'text-amber-600' }
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary-50">
      <div className="container mx-auto px-4 lg:px-8">
        <header className="mb-12">
           <h1 className="text-4xl font-serif font-bold text-secondary-950 mb-2 tracking-tight">Welcome, {user?.email || 'User'}</h1>
           <p className="text-secondary-500 font-medium tracking-tight uppercase text-xs">Account Overview • {user?.role === 'lawyer' ? 'Professional' : 'Client'} Access</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="card p-8 group relative overflow-hidden active:scale-95 transition-all">
                        <div className={`mb-6 p-3 rounded-xl bg-secondary-50 inline-block group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="text-3xl font-bold mb-1 text-secondary-950">{stat.value}</div>
                        <div className="text-secondary-500 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Upcoming Consultations */}
               <section className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-serif font-bold text-secondary-950">Upcoming Appointments</h2>
                     <button className="text-primary-600 text-sm font-bold flex items-center hover:translate-x-1 transition-transform uppercase tracking-wider">
                       Full Schedule <ChevronRight className="h-4 w-4 ml-1" />
                     </button>
                  </div>
                  <div className="space-y-4">
                      {bookings.length > 0 ? bookings.map((booking) => (
                          <div key={booking.id} className="card p-6 flex items-center gap-6 group hover:border-primary-200 transition-colors">
                              <div className="h-16 w-16 rounded-2xl bg-primary-100 flex flex-col items-center justify-center text-primary-700 shrink-0 font-bold border border-primary-200 shadow-sm">
                                 <span className="text-xs uppercase tracking-tighter">Day</span>
                                 <span className="text-xl leading-none">{new Date(booking.date).getDate() || '??'}</span>
                              </div>
                              <div className="flex-grow">
                                 <h4 className="font-bold text-secondary-950 text-lg">Consultation: {booking.title || 'Untitled Session'}</h4>
                                 <p className="text-secondary-500 text-sm flex items-center gap-2">
                                   <Clock className="h-4 w-4" /> {booking.time || 'TBD'} • {booking.status}
                                 </p>
                              </div>
                              <Link to={`/consultation/${booking.id}`} className="btn btn-primary !py-2 !px-4 text-xs shadow-none group-hover:shadow-md">Join Room</Link>
                          </div>
                      )) : (
                        <div className="p-12 text-center card bg-secondary-50">
                          <p className="text-secondary-400 font-bold uppercase text-xs tracking-widest">No scheduled consultations</p>
                        </div>
                      )}
                  </div>
               </section>

               {/* Recent Activity / Case History */}
               <section className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-secondary-950 mb-4">Recent Documents</h2>
                  <div className="card divide-y divide-secondary-100 overflow-hidden shadow-md">
                     {docs.length > 0 ? docs.map((doc) => (
                         <div key={doc.id} className="p-6 flex items-center justify-between group hover:bg-secondary-50 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary-900 leading-tight">{doc.name || 'document.pdf'}</h4>
                                    <p className="text-xs text-secondary-500 mt-1">Generated {new Date(doc.createdAt?.toDate()).toLocaleDateString()} • {doc.category}</p>
                                </div>
                            </div>
                            <button 
                              onClick={() => handleDownload(doc)}
                              className="p-3 bg-secondary-100 hover:bg-secondary-200 rounded-xl transition-all"
                            >
                               <Download className="h-5 w-5 text-secondary-600" />
                            </button>
                         </div>
                     )) : (
                        <div className="p-12 text-center bg-secondary-50">
                          <p className="text-secondary-400 font-bold uppercase text-xs tracking-widest">No documents generated yet</p>
                        </div>
                     )}
                     <div className="p-4 bg-secondary-50 text-center">
                        <Link to="/documents" className="text-secondary-500 text-xs font-bold uppercase tracking-widest hover:text-primary-600 transition-colors inline-block">Start New Document</Link>
                     </div>
                  </div>
               </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
