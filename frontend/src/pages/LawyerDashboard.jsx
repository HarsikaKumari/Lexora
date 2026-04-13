import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LEGAL_ISSUES = [
  'divorce',
  'property',
  'criminal',
  'corporate',
  'family',
  'civil',
  'tax',
];
const DOC_TYPES = [
  'affidavit',
  'contract',
  'divorce_petition',
  'will',
  'power_of_attorney',
];

const statusStyle = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  confirmed: { bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700' },
};

const emptyForm = {
  title: '',
  description: '',
  legal_issue: '',
  document_type: '',
  region: '',
  price: '',
  duration_minutes: 60,
};

export default function LawyerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my').then((res) => setBookings(res.data));
    api
      .get('/services')
      .then((res) =>
        setServices(res.data.filter((s) => s.lawyer_id === user?.id)),
      );
  }, [user]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/services', form);
      setServices([res.data, ...services]);
      setCreating(false);
      setForm(emptyForm);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  if (!user?.is_verified) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-md w-full'>
          <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-6 h-6 text-amber-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h2 className='text-lg font-semibold text-slate-900 mb-2'>
            Pending verification
          </h2>
          <p className='text-sm text-slate-500 leading-relaxed'>
            Your credentials are under review. An admin will verify your Bar
            Council ID and activate your account shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <div className='flex items-center gap-2 mb-0.5'>
            <h1 className='text-xl font-semibold text-slate-900'>
              {user?.name}
            </h1>
            <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium'>
              Verified
            </span>
          </div>
          <p className='text-sm text-slate-500'>
            Manage your services and client bookings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8'>
        {[
          {
            label: 'Active services',
            value: services.filter((s) => s.is_active).length,
          },
          { label: 'Total bookings', value: bookings.length },
          {
            label: 'Pending review',
            value: bookings.filter((b) => b.status === 'pending').length,
          },
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
          { key: 'services', label: `Services (${services.length})` },
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
              <p className='text-slate-400 text-sm'>No bookings received yet</p>
            </div>
          ) : (
            bookings.map((b) => {
              const st = statusStyle[b.status] || statusStyle.pending;
              return (
                <div
                  key={b.id}
                  className='bg-white border border-slate-200 rounded-xl px-5 py-4'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-slate-900'>
                        {b.client_name}
                      </p>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {b.title} ·{' '}
                        {new Date(b.booking_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        at {b.booking_time?.slice(0, 5)}
                      </p>
                      {b.notes && (
                        <p className='text-xs text-slate-400 mt-1 italic'>
                          "{b.notes}"
                        </p>
                      )}
                    </div>
                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.text}`}
                      >
                        {b.status}
                      </span>
                      {b.status === 'pending' && (
                        <div className='flex gap-1.5'>
                          <button
                            onClick={() => updateStatus(b.id, 'confirmed')}
                            className='text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors'
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            className='text-xs border border-slate-200 text-slate-600 px-3 py-1 rounded-lg hover:bg-slate-50 transition-colors'
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Services tab */}
      {tab === 'services' && (
        <>
          <div className='flex justify-end mb-4'>
            <button
              onClick={() => setCreating(!creating)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                creating
                  ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              }`}
            >
              {creating ? 'Cancel' : '+ Add service'}
            </button>
          </div>

          {creating && (
            <form
              onSubmit={handleCreateService}
              className='bg-white border border-slate-200 rounded-xl p-5 mb-4'
            >
              <h3 className='text-sm font-semibold text-slate-900 mb-4'>
                New service
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Service title
                  </label>
                  <input
                    required
                    placeholder='e.g. Divorce Consultation'
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Legal issue
                  </label>
                  <select
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.legal_issue}
                    onChange={(e) =>
                      setForm({ ...form, legal_issue: e.target.value })
                    }
                  >
                    <option value=''>Select…</option>
                    {LEGAL_ISSUES.map((i) => (
                      <option
                        key={i}
                        value={i}
                      >
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Document type
                  </label>
                  <select
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.document_type}
                    onChange={(e) =>
                      setForm({ ...form, document_type: e.target.value })
                    }
                  >
                    <option value=''>Select…</option>
                    {DOC_TYPES.map((d) => (
                      <option
                        key={d}
                        value={d}
                      >
                        {d.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Region
                  </label>
                  <input
                    placeholder='Mumbai, Delhi…'
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.region}
                    onChange={(e) =>
                      setForm({ ...form, region: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Price (₹)
                  </label>
                  <input
                    type='number'
                    required
                    placeholder='2500'
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder='Describe what this service includes…'
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  type='submit'
                  disabled={submitting}
                  className='bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50'
                >
                  {submitting ? 'Creating…' : 'Create service'}
                </button>
              </div>
            </form>
          )}

          <div className='space-y-2'>
            {services.length === 0 ? (
              <div className='text-center py-16 border border-dashed border-slate-200 rounded-xl'>
                <p className='text-slate-400 text-sm'>
                  No services yet. Add your first one.
                </p>
              </div>
            ) : (
              services.map((s) => (
                <div
                  key={s.id}
                  className='bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-slate-900'>
                      {s.title}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      {s.legal_issue && (
                        <span className='text-xs text-slate-500'>
                          {s.legal_issue}
                        </span>
                      )}
                      {s.region && (
                        <span className='text-xs text-slate-400'>
                          · {s.region}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <p className='text-sm font-semibold text-slate-900'>
                      ₹{s.price}
                    </p>
                    <p className='text-xs text-slate-400 mt-0.5'>
                      {s.duration_minutes} min
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
