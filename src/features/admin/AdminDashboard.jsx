import { useState, useEffect } from 'react'
import { ShieldCheck, UserX, UserCheck, AlertTriangle, Search, Activity, FileText, Plus, Users, Trash2, Mail, Briefcase, MapPin } from 'lucide-react'
import { getPendingLawyers, verifyLawyer, getAllUsers, addLawyerProfile, deleteUserProfile } from '../../firebase/services'

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('verifications')
  const [verifications, setVerifications] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Corporate Law',
    region: 'North America',
    barNumber: '',
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=400'
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pending, individuals] = await Promise.all([
        getPendingLawyers(),
        getAllUsers()
      ])
      setVerifications(pending)
      setAllUsers(individuals)
    } catch (error) {
      console.error("Admin fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleVerify = async (id) => {
    try {
      await verifyLawyer(id)
      setVerifications(verifications.filter(v => v.id !== id))
      fetchData() // Refresh directory
    } catch (error) {
       alert("Verification failed: " + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return
    try {
      await deleteUserProfile(id)
      setAllUsers(allUsers.filter(u => u.id !== id))
    } catch (error) {
      alert("Error deleting user: " + error.message)
    }
  }

  const handleAddLawyer = async (e) => {
    e.preventDefault()
    try {
      await addLawyerProfile(formData)
      alert("Lawyer profile added successfully!")
      setFormData({
        name: '', email: '', category: 'Corporate Law', region: 'North America', barNumber: '',
        image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=400'
      })
      setActiveTab('users')
      fetchData()
    } catch (error) {
      alert("Error adding lawyer: " + error.message)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary-950 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Admin Control Center</h1>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('verifications')}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'verifications' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-white'}`}
              >
                Pending Verifications ({verifications.length})
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-white'}`}
              >
                User Directory
              </button>
              <button 
                onClick={() => setActiveTab('add-lawyer')}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'add-lawyer' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-white'}`}
              >
                Add Professional
              </button>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-secondary-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <Activity className="h-5 w-5 text-emerald-500" />
                <div className="text-[10px] text-secondary-500 uppercase font-black">System: Healthy</div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
           {loading ? (
              <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
              </div>
           ) : (
             <>
               {activeTab === 'verifications' && (
                 <section className="space-y-6">
                   <h2 className="text-xl font-bold flex items-center gap-3"><AlertTriangle className="text-amber-500" /> Pending Approval</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {verifications.map((item) => (
                        <div key={item.id} className="card bg-secondary-900/50 p-6 flex flex-col sm:flex-row justify-between items-center group border-white/5 hover:bg-secondary-900 transition-colors">
                           <div className="flex items-center gap-6 mb-4 sm:mb-0">
                              <div className="h-14 w-14 rounded-full bg-primary-900/50 border border-primary-700 flex items-center justify-center text-xl font-bold uppercase">{item.name ? item.name[0] : 'L'}</div>
                              <div>
                                <h3 className="font-bold">{item.name || item.email}</h3>
                                <p className="text-xs text-secondary-500 font-mono mt-1">{item.barNumber} • {item.category}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => handleVerify(item.id)} className="btn btn-primary !py-2 !px-4 text-xs">Verify Profile</button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="h-5 w-5" /></button>
                           </div>
                        </div>
                     ))}
                     {verifications.length === 0 && <p className="text-secondary-500 text-xs font-bold uppercase tracking-widest p-12 text-center card bg-secondary-900/30">No pending verifications</p>}
                   </div>
                 </section>
               )}

               {activeTab === 'users' && (
                 <section className="space-y-6">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Users className="text-primary-400" /> Complete Repository</h2>
                   <div className="card bg-secondary-900/50 border-white/5 overflow-hidden">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-secondary-950/80 text-[10px] uppercase font-black tracking-widest text-secondary-500">
                            <tr>
                               <th className="px-6 py-4">Participant</th>
                               <th className="px-6 py-4">Role / Category</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Operations</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {allUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="h-8 w-8 rounded-lg bg-secondary-800 flex items-center justify-center text-xs font-bold">{u.name ? u.name[0] : (u.role === 'admin' ? 'A' : 'U')}</div>
                                     <span className="font-semibold">{u.name || (u.role === 'admin' ? 'System Admin' : u.email)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'lawyer' ? 'bg-primary-900/50 text-primary-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                                    {u.role}{u.category ? ` • ${u.category}` : ''}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {u.verified ? <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Active</span> : <span className="text-amber-500">Pending</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                   {u.role !== 'admin' && (
                                     <button onClick={() => handleDelete(u.id)} className="p-2 text-secondary-500 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                     </button>
                                   )}
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                 </section>
               )}

               {activeTab === 'add-lawyer' && (
                 <section className="max-w-2xl mx-auto py-10 scale-in">
                    <div className="card bg-secondary-900 p-10 border-white/5">
                       <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-primary-400"><Plus className="h-6 w-6" /> Manually Onboard Lawyer</h2>
                       <form onSubmit={handleAddLawyer} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="col-span-2 sm:col-span-1">
                                <label className="text-[10px] uppercase font-black text-secondary-500 tracking-widest mb-1 block">Full Name</label>
                                <input required type="text" className="input-field bg-secondary-950 border-white/5 text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                             </div>
                             <div className="col-span-2 sm:col-span-1">
                                <label className="text-[10px] uppercase font-black text-secondary-500 tracking-widest mb-1 block">Email Address</label>
                                <input required type="email" className="input-field bg-secondary-950 border-white/5 text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                             </div>
                             <div className="col-span-2 sm:col-span-1">
                                <label className="text-[10px] uppercase font-black text-secondary-500 tracking-widest mb-1 block">Expertise Area</label>
                                <select className="input-field bg-secondary-950 border-white/5 text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                   <option>Corporate Law</option>
                                   <option>Immigration</option>
                                   <option>Family Law</option>
                                   <option>Intellectual Property</option>
                                </select>
                             </div>
                             <div className="col-span-2 sm:col-span-1">
                                <label className="text-[10px] uppercase font-black text-secondary-500 tracking-widest mb-1 block">Region</label>
                                <select className="input-field bg-secondary-950 border-white/5 text-sm" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                                   <option>North America</option>
                                   <option>Europe</option>
                                   <option>Asia Pacific</option>
                                   <option>Remote</option>
                                </select>
                             </div>
                             <div className="col-span-2">
                                <label className="text-[10px] uppercase font-black text-secondary-500 tracking-widest mb-1 block">Bar Number / License</label>
                                <input required type="text" className="input-field bg-secondary-950 border-white/5 text-sm font-mono" value={formData.barNumber} onChange={(e) => setFormData({...formData, barNumber: e.target.value})} />
                             </div>
                          </div>
                          <button type="submit" className="btn btn-primary w-full py-4 mt-4 font-black uppercase text-xs tracking-[.25em]">Add to LexiLink Network</button>
                       </form>
                    </div>
                 </section>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  )
}
