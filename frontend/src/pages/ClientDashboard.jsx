import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusStyle = {
  pending: {
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    label: 'Pending',
  },
  confirmed: {
    dot: 'bg-green-400',
    text: 'text-green-700',
    bg: 'bg-green-50',
    label: 'Confirmed',
  },
  cancelled: {
    dot: 'bg-red-400',
    text: 'text-red-700',
    bg: 'bg-red-50',
    label: 'Cancelled',
  },
};

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tab, setTab] = useState('bookings');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/my').then((res) => setBookings(res.data));
    api.get('/documents/my').then((res) => setDocuments(res.data));
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl font-semibold text-slate-900'>
            Good day, {user?.name?.split(' ')[0]}
          </h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            Here's an overview of your activity
          </p>
        </div>
        <button
          onClick={() => navigate('/services')}
          className='bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors'
        >
          + New booking
        </button>
      </div>

      {/* Stats row */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8'>
        {[
          { label: 'Total bookings', value: bookings.length },
          {
            label: 'Confirmed',
            value: bookings.filter((b) => b.status === 'confirmed').length,
          },
          { label: 'Documents', value: documents.length },
        ].map((s) => (
          <div
            key={s.label}
            className='bg-slate-50 border border-slate-200 rounded-xl p-4'
          >
            <p className='text-2xl font-semibold text-slate-900'>{s.value}</p>
            <p className='text-xs text-slate-500 mt-0.5'>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit'>
        {[
          { key: 'bookings', label: `Bookings (${bookings.length})` },
          { key: 'documents', label: `Documents (${documents.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
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
            <div className='text-center py-16 border border-dashed border-slate-200 rounded-xl'>
              <p className='text-slate-400 text-sm'>No bookings yet</p>
              <button
                onClick={() => navigate('/services')}
                className='mt-3 text-sm text-slate-900 font-medium hover:underline'
              >
                Browse services →
              </button>
            </div>
          ) : (
            bookings.map((b) => {
              const st = statusStyle[b.status] || statusStyle.pending;
              return (
                <div
                  key={b.id}
                  className='bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4'
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${st.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-slate-900 truncate'>
                      {b.title}
                    </p>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      {b.lawyer_name} ·{' '}
                      {new Date(b.booking_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      at {b.booking_time?.slice(0, 5)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text} whitespace-nowrap`}
                  >
                    {st.label}
                  </span>
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
            <div className='text-center py-16 border border-dashed border-slate-200 rounded-xl'>
              <p className='text-slate-400 text-sm'>
                No documents generated yet
              </p>
            </div>
          ) : (
            documents.map((d) => (
              <div
                key={d.id}
                className='bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4'
              >
                <div className='w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-4 h-4 text-blue-600'
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
                  <p className='text-sm font-medium text-slate-900 capitalize'>
                    {d.document_type?.replace(/_/g, ' ')}
                  </p>
                  <p className='text-xs text-slate-500 mt-0.5'>
                    {new Date(d.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => alert(d.generated_content)}
                  className='text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors'
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
