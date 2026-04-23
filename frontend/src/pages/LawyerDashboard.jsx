import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LEGAL_ISSUES = [
  'family_law',
  'criminal_law',
  'corporate_law',
  'property_law',
  'labor_law',
  'tax_law',
  'intellectual_property',
  'immigration_law',
  'human_rights',
  'contract_law',
  'tort_law',
  'constitutional_law',
  'other',
];
const DOC_TYPES = [
  'affidavit',
  'contract',
  'divorce_petition',
  'will',
  'power_of_attorney',
];

const statusStyle = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    dot: 'bg-green-500',
    label: 'Confirmed',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    dot: 'bg-red-400',
    label: 'Cancelled',
  },
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
      .then((res) => setServices(res.data.services.filter((s) => s.lawyer_id === user?.id))
        // console.log(res.data.services);
        // setServices(res.data.filter((s) => s.lawyer_id === user?.id)),
        // }
      );
    // alert("Hello from useEffect");
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

  // const initials = user?.name
  //   ?.split(' ')
  //   .map((n) => n[0])
  //   .join('')
  //   .slice(0, 2)
  //   .toUpperCase();

  if (!user?.is_verified) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-md w-full'>
          <div
            className='w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4'
            style={{ background: '#FAEEDA' }}
          >
            <svg
              className='w-6 h-6'
              style={{ stroke: '#854F0B' }}
              fill='none'
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
          <h2 className='text-[16px] font-medium text-slate-900 mb-2'>
            Pending verification
          </h2>
          <p className='text-[13px] text-slate-500 leading-relaxed'>
            Your credentials are under review. An admin will verify your Bar
            Council ID and activate your account shortly.
          </p>
        </div>
      </div>
    );
  }

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
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p
              className='text-[13px] mt-1'
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Manage your services and client bookings
            </p>
          </div>
          <button
            onClick={() => {
              setTab('services');
              setCreating(true);
            }}
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
            Add service
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className='grid grid-cols-3 bg-white border-b border-slate-200'>
        {[
          {
            label: 'Active services',
            value: services.filter((s) => s.is_active).length,
            hint: 'Live listings',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-700',
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
            label: 'Total bookings',
            value: bookings.length,
            hint: 'All time',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-700',
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
            label: 'Pending review',
            value: bookings.filter((b) => b.status === 'pending').length,
            hint: 'Awaiting action',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
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
            { key: 'services', label: `Services (${services.length})` },
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
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <p className='text-[14px] font-medium text-slate-500'>
                  No bookings received yet
                </p>
              </div>
            ) : (
              bookings.map((b) => {
                const st = statusStyle[b.status] || statusStyle.pending;
                return (
                  <div
                    key={b.id}
                    className='bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-blue-200 transition-colors'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex items-start gap-3 min-w-0'>
                        <div
                          className={`w-9 h-9 rounded-lg ${st.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-[13px] font-medium text-slate-900'>
                            {b.client_name}
                          </p>
                          <p className='text-[12px] text-slate-500 mt-0.5'>
                            {b.title} ·{' '}
                            {new Date(b.booking_date).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                              },
                            )}{' '}
                            at {b.booking_time?.slice(0, 5)}
                          </p>
                          {b.notes && (
                            <p className='text-[12px] text-slate-400 mt-1 italic'>
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.text}`}
                        >
                          {st.label}
                        </span>
                        {b.status === 'pending' && (
                          <div className='flex gap-1.5'>
                            <button
                              onClick={() => updateStatus(b.id, 'confirmed')}
                              className='text-[12px] text-white px-3 py-1.5 rounded-lg transition-colors'
                              style={{ background: '#3B6D11' }}
                              onMouseOver={(e) =>
                                (e.target.style.background = '#27500A')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.background = '#3B6D11')
                              }
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, 'cancelled')}
                              className='text-[12px] border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors'
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
                className='flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors'
                style={
                  creating
                    ? {
                      background: 'transparent',
                      color: '#185FA5',
                      border: '0.5px solid #B5D4F4',
                    }
                    : { background: '#185FA5', color: '#fff', border: 'none' }
                }
              >
                {!creating && (
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
                )}
                {creating ? 'Cancel' : 'Add service'}
              </button>
            </div>

            {creating && (
              <form
                onSubmit={handleCreateService}
                className='bg-white border border-blue-100 rounded-xl p-6 mb-4'
                style={{ borderColor: '#B5D4F4' }}
              >
                <div className='flex items-center gap-2 mb-5'>
                  <div
                    className='w-1 h-5 rounded-full'
                    style={{ background: '#185FA5' }}
                  />
                  <h3 className='text-[14px] font-medium text-slate-900'>
                    New service
                  </h3>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <div className='sm:col-span-2'>
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Service title
                    </label>
                    <input
                      required
                      placeholder='e.g. Divorce Consultation'
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition'
                      style={{ '--tw-ring-color': '#185FA5' }}
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Legal issue
                    </label>
                    <select
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition'
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
                          {i.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Document type
                    </label>
                    <select
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition'
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
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Region
                    </label>
                    <input
                      placeholder='Mumbai, Delhi…'
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition'
                      value={form.region}
                      onChange={(e) =>
                        setForm({ ...form, region: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Price (₹)
                    </label>
                    <input
                      type='number'
                      required
                      placeholder='2500'
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition'
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                  </div>
                  <div className='sm:col-span-2'>
                    <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder='Describe what this service includes…'
                      className='w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] resize-none focus:outline-none transition'
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='flex justify-end mt-5'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='text-[13px] font-medium text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50'
                    style={{ background: '#185FA5' }}
                  >
                    {submitting ? 'Creating…' : 'Create service'}
                  </button>
                </div>
              </form>
            )}

            <div className='space-y-2'>
              {services.length === 0 ? (
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
                        d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                      />
                    </svg>
                  </div>
                  <p className='text-[14px] font-medium text-slate-500'>
                    No services yet
                  </p>
                  <button
                    onClick={() => setCreating(true)}
                    className='mt-4 text-[13px] font-medium text-white px-4 py-2 rounded-lg'
                    style={{ background: '#185FA5' }}
                  >
                    Add your first service →
                  </button>
                </div>
              ) : (
                services.map((s) => (
                  <div
                    key={s.id}
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
                          d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                        />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-[13px] font-medium text-slate-900'>
                        {s.title}
                      </p>
                      <div className='flex items-center gap-1.5 mt-1'>
                        {s.legal_issue && (
                          <span className='text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium'>
                            {s.legal_issue.replace(/_/g, ' ')}
                          </span>
                        )}
                        {s.region && (
                          <span className='text-[11px] text-slate-400'>
                            · {s.region}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-[14px] font-medium text-slate-900'>
                        ₹{s.price}
                      </p>
                      <p className='text-[11px] text-slate-400 mt-0.5'>
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
    </div>
  );
}
