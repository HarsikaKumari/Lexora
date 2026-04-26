import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';

const statusStyle = {
  pending: {
    dot: 'bg-amber-400',
    text: 'text-amber-800',
    bg: 'bg-amber-50',
    label: 'Pending',
  },
  confirmed: {
    dot: 'bg-green-500',
    text: 'text-green-800',
    bg: 'bg-green-50',
    label: 'Confirmed',
  },
  cancelled: {
    dot: 'bg-red-400',
    text: 'text-red-800',
    bg: 'bg-red-50',
    label: 'Cancelled',
  },
};

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [showChat, setShowChat] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/my').then((res) => setBookings(res.data));
    api.get('/documents/my').then((res) => setDocuments(res.data));
  }, []);

  const openChatWithLawyer = () => {
    console.log('📱 Opening chat from client side...');
    console.log('Current user:', user?.id, user?.name);

    // Get unique lawyers from bookings
    const uniqueLawyers = [];
    const lawyerMap = new Map();

    bookings.forEach(booking => {
      if (booking.service?.lawyer && !lawyerMap.has(booking.service.lawyer.id)) {
        lawyerMap.set(booking.service.lawyer.id, booking.service.lawyer);
        uniqueLawyers.push(booking.service.lawyer);
      }
    });

    if (uniqueLawyers.length > 0) {
      console.log('✅ Found lawyer from booking:', uniqueLawyers[0]);
      setSelectedLawyer(uniqueLawyers[0]);
      setShowChat(true);
    } else {
      // ✅ FALLBACK: Direct lawyer ID agar booking nahi hai toh
      console.log('⚠️ No lawyer found in bookings, using default lawyer (ID: 10 - harsika)');
      setSelectedLawyer({
        id: 10,        // harsika lawyer ki ID
        name: "harsika (Lawyer)"
      });
      setShowChat(true);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Hero */}
      <div
        className='relative overflow-hidden px-7 py-9'
        style={{ background: '#185FA5' }}
      >
        <div
          className='absolute rounded-full'
          style={{
            width: 220,
            height: 220,
            background: 'rgba(255,255,255,0.06)',
            right: -40,
            top: -60,
          }}
        />
        <div
          className='absolute rounded-full'
          style={{
            width: 160,
            height: 160,
            background: 'rgba(255,255,255,0.04)',
            right: 80,
            bottom: -80,
          }}
        />
        <div className='relative flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-[26px] font-medium text-white tracking-tight'>
              Good day, {user?.name?.split(' ')[0]}
            </h1>
            <p
              className='text-[13px] mt-1'
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Here's an overview of your legal activity
            </p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={openChatWithLawyer}
              className='flex items-center gap-2 bg-white/20 backdrop-blur-sm font-medium text-[13px] px-4 py-2.5 rounded-lg flex-shrink-0 hover:bg-white/30 transition-colors text-white'
            >
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
              Chat
            </button>
            <button
              onClick={() => navigate('/services')}
              className='flex items-center gap-2 bg-white font-medium text-[13px] px-4 py-2.5 rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors'
              style={{ color: '#0C447C' }}
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              New booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className='grid grid-cols-3 bg-white border-b border-slate-200'>
        {[
          {
            label: 'Total bookings',
            value: bookings.length,
            hint: 'All time',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            ),
          },
          {
            label: 'Confirmed',
            value: bookings.filter((b) => b.status === 'confirmed').length,
            hint: 'Active sessions',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            ),
          },
          {
            label: 'Documents',
            value: documents.length,
            hint: 'Generated',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            ),
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-5 ${i < 2 ? 'border-r border-slate-200' : ''}`}
          >
            <div className='flex items-center gap-2.5 mb-2.5'>
              <div
                className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}
              >
                <svg
                  className={`w-4 h-4 ${s.iconColor}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {s.icon}
                </svg>
              </div>
              <span className='text-[11px] font-medium text-slate-500 uppercase tracking-wide'>
                {s.label}
              </span>
            </div>
            <p className='text-[32px] font-medium text-slate-900 leading-none tracking-tight'>
              {s.value}
            </p>
            <p className='text-[11px] text-slate-400 mt-1'>{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className='max-w-5xl mx-auto px-7 py-6'>
        {/* Tabs */}
        <div className='flex border-b border-slate-200 mb-6'>
          {[
            { key: 'bookings', label: `Bookings (${bookings.length})` },
            { key: 'documents', label: `Documents (${documents.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[13px] font-medium px-4 py-2.5 border-b-2 -mb-px transition-colors ${tab === t.key
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className='space-y-2'>
            {bookings.length === 0 ? (
              <div className='text-center py-14 rounded-xl bg-white border border-slate-200'>
                <div
                  className='w-13 h-13 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3'
                  style={{ width: 52, height: 52 }}
                >
                  <svg
                    className='w-5 h-5 text-blue-700'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <p className='text-[14px] font-medium text-slate-500'>
                  No bookings yet
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className='mt-4 text-[13px] font-medium text-white px-4 py-2 rounded-lg'
                  style={{ background: '#185FA5' }}
                >
                  Browse services →
                </button>
              </div>
            ) : (
              bookings.map((b) => {
                console.log(b);
                const st = statusStyle[b.status] || statusStyle.pending;
                return (
                  <div className='flex flex-col' key={b.id}>
                    <div
                      className='bg-white border border-slate-200 rounded-xl px-5 py-4 items-center gap-4 hover:border-blue-200 transition-colors'
                    >
                      <div className='flex'>

                        <div
                          className={`w-9 h-9 rounded-lg ${st.bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                        </div>
                        <span className='text-black text-lg font-bold capitalize'>
                          {b.service?.lawyer?.name?.toUpperCase() || 'Lawyer'}{' '}
                        </span>
                        <span className='text-black text-lg font-bold '>
                        </span>
                        <div className='flex-1 min-w-0'>
                          <p className='text-[13px] font-medium text-slate-900 truncate'>
                            {b.title}
                          </p>
                          <p className='text-[12px] text-slate-500 mt-0.5'>
                            {new Date(b.booking_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            at {b.booking_time?.slice(0, 5)}
                          </p>
                        </div>
                        <span
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text} whitespace-nowrap`}
                        >
                          {st.label}
                        </span>

                      </div>
                      <div className='flex items-start px-5 py-3 mt-3 bg-slate-50 rounded-lg text-gray-600 text-[1.2rem]'>
                        <p className='text-[13px] font-medium text-slate-900 mt-3'>
                          {b.service?.description}
                        </p>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Documents tab */}
        {tab === 'documents' && (
          <div className='space-y-2'>
            {documents.length === 0 ? (
              <div className='text-center py-14 rounded-xl bg-white border border-slate-200'>
                <div
                  className='rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3'
                  style={{ width: 52, height: 52 }}
                >
                  <svg
                    className='w-5 h-5 text-blue-700'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <p className='text-[14px] font-medium text-slate-500'>
                  No documents generated yet
                </p>
              </div>
            ) : (
              documents.map((d) => (
                <div
                  key={d.id}
                  className='bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-blue-200 transition-colors'
                >
                  <div className='w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                    <svg
                      className='w-4 h-4 text-blue-700'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] font-medium text-slate-900 capitalize'>
                      {d.document_type?.replace(/_/g, ' ')}
                    </p>
                    <p className='text-[12px] text-slate-500 mt-0.5'>
                      {new Date(d.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => alert(d.generated_content)}
                    className='text-[12px] text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors'
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {showChat && selectedLawyer && (
        <ChatWindow
          otherUserId={selectedLawyer.id}
          otherUserName={selectedLawyer.name}
          onClose={() => {
            setShowChat(false);
            setSelectedLawyer(null);
          }}
        />
      )}
    </div>
  );
}
