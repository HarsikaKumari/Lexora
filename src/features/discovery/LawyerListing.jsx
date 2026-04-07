import { useState, useEffect } from 'react'
import { Search, Filter, Star, MapPin, Globe, CheckCircle, ArrowRight, X, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getLawyers, createBooking } from '../../firebase/services'

const FEATURED_LAWYERS = [
  {
    id: 'f1',
    name: 'Sarah Jenkins',
    category: 'Corporate Law',
    region: 'North America',
    rating: 4.9,
    reviews: 124,
    languages: ['English', 'Spanish'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    verified: true,
    price: '$150/hr'
  },
  {
    id: 'f2',
    name: 'Michael Chen',
    category: 'Intellectual Property',
    region: 'Asia Pacific',
    rating: 4.8,
    reviews: 89,
    languages: ['English', 'Mandarin'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    verified: true,
    price: '$200/hr'
  },
  {
    id: 'f3',
    name: 'Elena Rodriguez',
    category: 'Family Law',
    region: 'Europe',
    rating: 5.0,
    reviews: 56,
    languages: ['Spanish', 'French'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    verified: true,
    price: '$120/hr'
  }
]

export default function LawyerListing({ user }) {
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')

  // Modal states
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true)
      try {
        const data = await getLawyers({ category, region })
        setLawyers(data)
      } catch (error) {
        console.error("Error fetching lawyers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLawyers()
  }, [category, region])

  const displayList = lawyers.length > 0 ? lawyers : FEATURED_LAWYERS;

  const filteredLawyers = displayList.filter(l => {
    const name = l.name || '';
    const cat = l.category || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || cat.toLowerCase().includes(search);
  })

  const handleBook = async () => {
    if (!user) {
      navigate('/auth')
      return
    }
    
    setBookingLoading(true)
    try {
      await createBooking({
        clientId: user.uid || 'anon',
        clientName: user.email || 'Anonymous',
        lawyerId: selectedLawyer.id || 'unknown',
        lawyerName: selectedLawyer.name || 'Legal Professional',
        title: `Consultation with ${selectedLawyer.name || 'Legal Professional'}`,
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Default: 3 days from now
        time: '10:00 AM',
        category: selectedLawyer.category || 'General'
      })
      alert("Consultation booked successfully!")
      setIsBookingModalOpen(false)
      navigate('/dashboard')
    } catch (error) {
      alert("Booking failed: " + error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="card p-6">
              <h4 className="font-bold mb-4 flex items-center"><Filter className="h-4 w-4 mr-2" /> Filters</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Issue Type</label>
                  <select 
                    className="input-field mt-1 text-sm bg-secondary-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Immigration">Immigration</option>
                    <option value="Family Law">Family Law</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Region</label>
                  <select 
                    className="input-field mt-1 text-sm bg-secondary-50"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="">Global</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="relative mb-8 shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by name, expertise, or case description..."
                className="input-field py-4 pl-12 shadow-inner border-none focus:ring-primary-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLawyers.map((lawyer) => (
                  <div key={lawyer.id} className="card p-6 flex flex-col sm:flex-row gap-6 hover:translate-y-[-4px] transition-all">
                    <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-secondary-100 shadow-sm bg-secondary-100 flex items-center justify-center">
                      {lawyer.image ? (
                        <img src={lawyer.image} alt={lawyer.name || 'Lawyer'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-secondary-400 text-3xl font-serif font-bold uppercase">
                          {(lawyer.name || 'L')[0]}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            {lawyer.name}
                            {lawyer.verified && <CheckCircle className="h-4 w-4 text-primary-500" fill="currentColor" />}
                          </h3>
                          <p className="text-primary-600 font-semibold text-sm">{lawyer.category || 'Legal Professional'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-secondary-900">{lawyer.price || '$100+/hr'}</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-4 text-xs font-semibold text-secondary-500 mb-4 bg-secondary-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {lawyer.region || 'Remote'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {lawyer.languages?.join(', ') || 'English'}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" /> {lawyer.rating || 'New'} {lawyer.reviews ? `(${lawyer.reviews})` : ''}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setSelectedLawyer(lawyer); setIsBookingModalOpen(true); }}
                          className="btn btn-primary !py-2 text-sm flex-grow shadow-none"
                        >
                          Book Consultation
                        </button>
                        <button 
                          onClick={() => { setSelectedLawyer(lawyer); setIsProfileModalOpen(true); }}
                          className="btn btn-outline !py-2 text-sm border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredLawyers.length === 0 && (
                  <div className="col-span-2 text-center py-20 card">
                    <p className="text-secondary-500 font-bold uppercase tracking-widest text-sm">No legal professionals found matching your criteria</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Profile Modal */}
      {isProfileModalOpen && selectedLawyer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl scale-in group text-left">
             <div className="relative h-48 bg-primary-900 overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400 blur-[80px] rounded-full opacity-30" />
                <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><X className="h-6 w-6" /></button>
                <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-3xl border-[6px] border-white bg-secondary-100 overflow-hidden shadow-lg">
                   {selectedLawyer.image ? (
                     <img src={selectedLawyer.image} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-3xl font-serif font-bold text-secondary-400">
                        {(selectedLawyer.name || 'L')[0]}
                     </div>
                   )}
                </div>
             </div>
             <div className="p-10 pt-16">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-3xl font-serif font-bold text-secondary-950 flex items-center gap-2">
                        {selectedLawyer.name}
                        {selectedLawyer.verified && <CheckCircle className="h-6 w-6 text-primary-500" fill="currentColor" />}
                      </h2>
                      <p className="text-primary-600 font-bold uppercase text-xs tracking-widest mt-1">{selectedLawyer.category}</p>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-bold text-secondary-900">{selectedLawyer.price || '$100+/hr'}</div>
                      <p className="text-[10px] text-secondary-400 font-black uppercase tracking-tighter">Per Session</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-secondary-100">
                   <div>
                      <h4 className="text-[10px] uppercase font-black text-secondary-400 mb-2 tracking-widest">Office Location</h4>
                      <p className="font-bold flex items-center gap-2 text-secondary-900"><MapPin className="h-4 w-4 text-primary-400" /> {selectedLawyer.region || 'Global / Remote'}</p>
                   </div>
                   <div>
                      <h4 className="text-[10px] uppercase font-black text-secondary-400 mb-2 tracking-widest">Global Ranking</h4>
                      <p className="font-bold flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-amber-500" /> {selectedLawyer.rating || 'New Account'} / 5.0</p>
                   </div>
                </div>
                <p className="text-secondary-600 leading-relaxed italic mb-8">"Providing world-class legal solutions for complex challenges in {selectedLawyer.category || 'Law'}. Registered professional with verified credentials across multiple jurisdictions."</p>
                <button onClick={() => { setIsProfileModalOpen(false); setIsBookingModalOpen(true); }} className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-[.2em]">Initiate Booking Protocol</button>
             </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {isBookingModalOpen && selectedLawyer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-md p-10 shadow-2xl scale-in text-center">
             <div className="h-16 w-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600 mx-auto">
                <Calendar className="h-8 w-8" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-secondary-950 mb-2">Confirm Booking</h2>
             <p className="text-secondary-500 mb-8 font-medium">You are about to book a session with <span className="text-primary-600 font-bold">{selectedLawyer.name}</span>. The session will be scheduled for <span className="text-secondary-950 font-bold">Next Monday at 10:00 AM</span>.</p>
             <div className="space-y-4">
                <button 
                  onClick={handleBook} 
                  disabled={bookingLoading}
                  className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-widest"
                >
                   {bookingLoading ? 'Processing Request...' : 'Finalize Reservation'}
                </button>
                <button onClick={() => setIsBookingModalOpen(false)} className="w-full text-secondary-400 text-[10px] font-black uppercase tracking-widest hover:text-secondary-600 transition-colors">Cancel Protocol</button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
