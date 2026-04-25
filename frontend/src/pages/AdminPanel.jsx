import { useState, useEffect } from 'react';
import api from '../api/axios';

const roleBadge = {
  lawyer: { bg: '#EEEDFE', color: '#534AB7' },
  admin: { bg: '#FAEEDA', color: '#854F0B' },
  client: { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch users and stats
    api.get('/admin/users').then((res) => setUsers(res.data));
    api.get('/admin/stats').then((res) => setStats(res.data));

    // Fetch services and bookings for admin
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      // console.log('Services API response:', res.data);

      // Handle different response structures
      if (res.data && Array.isArray(res.data.services)) {
        setServices(res.data.services);
      } else if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');

      // Handle different response structures
      if (res.data && Array.isArray(res.data.data)) {
        setBookings(res.data.data);
      } else if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    }
  };
  // console.log('Bookings API response:', bookings);

  const toggleVerify = async (id, currentStatus, userRole) => {
    // Only allow verification toggle for lawyers
    if (userRole !== 'lawyer') return;

    try {
      const res = await api.patch(`/admin/users/${id}/verify`, {
        is_verified: !currentStatus,
      });

      // Update the user in the state
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, is_verified: res.data.is_verified } : u,
        ),
      );

      // Optional: Show success toast/notification
      console.log(`User verification status updated to: ${res.data.is_verified}`);
    } catch (err) {
      console.error('Verification failed:', err);
      // Optional: Show error message to user
      alert(err.response?.data?.error || 'Failed to update verification status');
    }
  };

  const handleStatClick = (tab) => {
    setActiveTab(tab);
    setFilter('all');
    setSearch('');
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setModalOpen(true);
  };

  const filteredUsers = users
    .filter((u) => filter === 'all' || u.role === filter)
    .filter(
      (u) =>
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()),
    );

  const filteredServices = Array.isArray(services) ? services.filter(
    (s) =>
      !search ||
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.lawyer?.name?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(
    (b) =>
      !search ||
      b.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.status?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const pendingLawyers = users.filter(
    (u) => u.role === 'lawyer' && !u.is_verified,
  ).length;

  const statsCards = [
    {
      key: 'users',
      label: 'Total users',
      value: stats.total_users || 0,
      hint: 'Registered accounts',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
      activeTab: 'users',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
        />
      ),
    },
    {
      key: 'services',
      label: 'Total services',
      value: stats.total_services || 0,
      hint: 'Live listings',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-700',
      activeTab: 'services',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
        />
      ),
    },
    {
      key: 'bookings',
      label: 'Total bookings',
      value: stats.total_bookings || 0,
      hint: 'All time',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-700',
      activeTab: 'bookings',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Lawyer</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[13px] text-slate-400">
                      No services found
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '0.5px solid #f1f5f9' }}>
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="text-[12px] font-medium text-slate-900 truncate">{s.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{s.legal_issue || '—'}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-500">{s.lawyer?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-[12px] font-medium text-slate-700">₹{s.price}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleViewDetails(s, 'service')}
                          className="text-[11px] px-2.5 py-1 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      case 'bookings':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Service</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Booking Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[13px] text-slate-400">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '0.5px solid #f1f5f9' }}>
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="text-[12px] font-medium text-slate-900 truncate">{b.client?.name || '—'}</div>
                          <div className="text-[11px] text-slate-400 truncate">{b.client?.email || '—'}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-500 truncate">{b.service?.title || '—'}</td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-500">{new Date(b.booking_date).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium
                          ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : ''}
                          ${b.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : ''}
                          ${b.status === 'completed' ? 'bg-blue-50 text-blue-700' : ''}
                          ${b.status === 'cancelled' ? 'bg-red-50 text-red-700' : ''}
                        `}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleViewDetails(b, 'booking')}
                          className="text-[11px] px-2.5 py-1 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '22%' }} />
                <col style={{ width: '26%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                  {['Name', 'Email', 'Role', 'License ID', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-[13px] text-slate-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const badge = roleBadge[u.role] || { bg: '#f1f5f9', color: '#475569' };
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '0.5px solid #f1f5f9' }}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-medium" style={{ background: '#E6F1FB', color: '#185FA5' }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[12px] font-medium text-slate-900 truncate">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-slate-500 truncate">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: badge.bg, color: badge.color }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-slate-400 truncate">{u.unique_identifier || '—'}</td>
                        <td className="px-5 py-3.5">
                          {u.is_verified ? (
                            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#3B6D11' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#854F0B' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className='px-5 py-3.5'>
                          {u.role === 'lawyer' && (
                            <button
                              onClick={() => toggleVerify(u.id, u.is_verified, u.role)}
                              className={`text-[12px] px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${u.is_verified
                                ? 'bg-transparent text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                                : 'bg-[#185FA5] text-white shadow-sm hover:bg-[#0e4880] hover:shadow-md'
                                }`}
                            >
                              {u.is_verified ? (
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Revoke
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Verify
                                </span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        );
    }
  };

  const getTotalForTab = () => {
    switch (activeTab) {
      case 'services': return filteredServices.length;
      case 'bookings': return filteredBookings.length;
      default: return filteredUsers.length;
    }
  };

  const getTotalOverall = () => {
    switch (activeTab) {
      case 'services': return services.length;
      case 'bookings': return bookings.length;
      default: return users.length;
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Hero */}
      <div className='relative overflow-hidden px-7 py-9' style={{ background: '#185FA5' }}>
        <div className='absolute rounded-full' style={{ width: 220, height: 220, background: 'rgba(255,255,255,0.06)', right: -40, top: -60 }} />
        <div className='absolute rounded-full' style={{ width: 160, height: 160, background: 'rgba(255,255,255,0.04)', right: 80, bottom: -80 }} />
        <div className='relative'>
          <h1 className='text-[26px] font-medium text-white tracking-tight'>Admin panel</h1>
          <p className='text-[13px] mt-1' style={{ color: 'rgba(255,255,255,0.65)' }}>
            Manage users, verifications, and platform activity
          </p>
        </div>
      </div>

      {/* Clickable Stats strip */}
      <div className='grid grid-cols-3 bg-white border-b border-slate-200'>
        {statsCards.map((s, i) => (
          <div
            key={s.label}
            onClick={() => handleStatClick(s.activeTab)}
            className={`px-6 py-5 ${i < 2 ? 'border-r border-slate-200' : ''} cursor-pointer transition-all hover:bg-slate-50 ${activeTab === s.activeTab ? 'ring-2 ring-inset ring-blue-200 bg-blue-50/20' : ''
              }`}
          >
            <div className='flex items-center gap-2.5 mb-2.5'>
              <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                <svg className={`w-4 h-4 ${s.iconColor}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  {s.icon}
                </svg>
              </div>
              <span className='text-[11px] font-medium text-slate-500 uppercase tracking-wide'>{s.label}</span>
            </div>
            <p className='text-[32px] font-medium text-slate-900 leading-none tracking-tight'>{s.value}</p>
            <p className='text-[11px] text-slate-400 mt-1'>{s.hint}</p>
          </div>
        ))}
      </div>

      <div className='max-w-7xl mx-auto px-7 py-6'>
        {/* Pending alert - only show on users tab */}
        {activeTab === 'users' && pendingLawyers > 0 && (
          <div className='flex items-center justify-between px-4 py-3 rounded-xl mb-6 border' style={{ background: '#FAEEDA', borderColor: '#FAC775' }}>
            <div className='flex items-center gap-2.5'>
              <div className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'rgba(239,159,39,0.2)' }}>
                <svg className='w-3.5 h-3.5' style={{ stroke: '#854F0B' }} fill='none' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <p className='text-[13px]' style={{ color: '#633806' }}>
                <span className='font-medium'>{pendingLawyers} lawyer{pendingLawyers > 1 ? 's' : ''}</span> waiting for verification
              </p>
            </div>
            <button onClick={() => setFilter('lawyer')} className='text-[12px] font-medium hover:underline' style={{ color: '#854F0B' }}>
              Review now →
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className='mb-4 px-5'>
          <input
            type='text'
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Tab-specific table */}
        <div className='bg-white border border-slate-200 rounded-xl overflow-hidden'>
          {/* Toolbar */}
          <div className='px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-1 h-5 rounded-full' style={{ background: '#185FA5' }} />
              <h2 className='text-[15px] font-medium text-slate-800'>
                {activeTab === 'users' ? 'All Users' : activeTab === 'services' ? 'All Services' : 'All Bookings'}
              </h2>
              <span className='text-[12px] ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>
                {getTotalForTab()} / {getTotalOverall()}
              </span>
            </div>
            {activeTab === 'users' && filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className='text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200'
              >
                Clear filter: {filter} ✕
              </button>
            )}
          </div>
          {renderContent()}
        </div>
      </div>

      {/* Modal for View Details */}
      {modalOpen && selectedItem && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-slate-900'>
                {selectedItem.type === 'service' ? 'Service Details' : 'Booking Details'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className='text-slate-400 hover:text-slate-600 text-2xl'
              >
                ×
              </button>
            </div>
            <div className='p-6'>
              {selectedItem.type === 'service' ? (
                <div className='space-y-3'>
                  <div><strong className='text-slate-600'>Title:</strong> <span className='text-slate-800'>{selectedItem.title}</span></div>
                  <div><strong className='text-slate-600'>Description:</strong> <span className='text-slate-800'>{selectedItem.description}</span></div>
                  <div><strong className='text-slate-600'>Price:</strong> <span className='text-slate-800'>₹{selectedItem.price}</span></div>
                  <div><strong className='text-slate-600'>Lawyer:</strong> <span className='text-slate-800'>{selectedItem.lawyer?.name || '—'}</span></div>
                  <div><strong className='text-slate-600'>Legal Issue:</strong> <span className='text-slate-800'>{selectedItem.legal_issue || '—'}</span></div>
                  <div><strong className='text-slate-600'>Status:</strong> <span className='text-slate-800'>{selectedItem.is_active ? 'Active' : 'Inactive'}</span></div>
                </div>
              ) : (
                <div className='space-y-3'>
                  <div><strong className='text-slate-600'>Client:</strong> <span className='text-slate-800'>{selectedItem.client?.name || '—'}</span></div>
                  <div><strong className='text-slate-600'>Service:</strong> <span className='text-slate-800'>{selectedItem.service?.title || '—'}</span></div>
                  <div><strong className='text-slate-600'>Booking Date:</strong> <span className='text-slate-800'>{new Date(selectedItem.booking_date).toLocaleString()}</span></div>
                  <div><strong className='text-slate-600'>Status:</strong> <span className='text-slate-800'>{selectedItem.status}</span></div>
                  {selectedItem.notes && <div><strong className='text-slate-600'>Notes:</strong> <span className='text-slate-800'>{selectedItem.notes}</span></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}