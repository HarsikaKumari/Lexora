import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function BookingPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({
    booking_date: '',
    booking_time: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/services/${serviceId}`).then((res) => setService(res.data));
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', { service_id: serviceId, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/client'), 2500);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!service)
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div
            className='w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-3 animate-spin'
            style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}
          />
          <p className='text-[13px] text-slate-400'>Loading service details…</p>
        </div>
      </div>
    );

  if (success)
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-sm w-full'>
          <div
            className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5'
            style={{ background: '#EAF3DE' }}
          >
            <svg
              className='w-7 h-7'
              style={{ stroke: '#3B6D11' }}
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='text-[18px] font-medium text-slate-900 mb-2'>
            Booking confirmed!
          </h2>
          <p className='text-[13px] text-slate-500 mb-6'>
            Your consultation has been scheduled.
          </p>
          <div className='w-full bg-slate-100 rounded-full h-1 overflow-hidden'>
            <div
              className='h-full rounded-full animate-pulse'
              style={{ width: '60%', background: '#185FA5' }}
            />
          </div>
          <p className='text-[12px] text-slate-400 mt-3'>
            Redirecting to dashboard…
          </p>
        </div>
      </div>
    );

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
        <div className='relative max-w-2xl mx-auto'>
          <Link
            to='/services'
            className='inline-flex items-center gap-1.5 text-[13px] font-medium mb-4'
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to services
          </Link>
          <h1 className='text-[26px] font-medium text-white tracking-tight'>
            Complete your booking
          </h1>
          <p
            className='text-[13px] mt-1'
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Fill in the details to schedule your consultation
          </p>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-4 py-8'>
        {/* Service summary card */}
        <div
          className='rounded-xl p-5 mb-6 border'
          style={{ background: '#0C447C', borderColor: '#0C447C' }}
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-3 min-w-0'>
              <div
                className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                  />
                </svg>
              </div>
              <div className='min-w-0'>
                <p
                  className='text-[11px] font-medium uppercase tracking-wide mb-1'
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {service.category || 'Legal service'}
                </p>
                <h2 className='text-[15px] font-medium text-white leading-snug'>
                  {service.title}
                </h2>
                <div className='flex flex-wrap gap-x-4 gap-y-1 mt-1.5'>
                  {service.lawyer_name && (
                    <span
                      className='flex items-center gap-1 text-[12px]'
                      style={{ color: 'rgba(255,255,255,0.7)' }}
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
                          strokeWidth={1.5}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                      {service.lawyer_name}
                    </span>
                  )}
                  {service.region && (
                    <span
                      className='flex items-center gap-1 text-[12px]'
                      style={{ color: 'rgba(255,255,255,0.7)' }}
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
                          strokeWidth={1.5}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {service.region}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div
              className='rounded-lg px-4 py-2.5 text-right flex-shrink-0'
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <p
                className='text-[10px] uppercase tracking-wide mb-0.5'
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Total fee
              </p>
              <p className='text-[20px] font-medium text-white'>
                ₹{service.price}
              </p>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className='bg-white border border-slate-200 rounded-xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100 flex items-center gap-2'>
            <div
              className='w-1 h-5 rounded-full'
              style={{ background: '#185FA5' }}
            />
            <div>
              <h2 className='text-[14px] font-medium text-slate-900'>
                Schedule your consultation
              </h2>
              <p className='text-[12px] text-slate-400 mt-0.5'>
                Choose a date and time that works for you
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className='p-6 space-y-5'
          >
            {/* Date + Time */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                  Select date
                </label>
                <div className='relative'>
                  <input
                    type='date'
                    required
                    className='w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none transition'
                    value={form.booking_date}
                    onChange={(e) =>
                      setForm({ ...form, booking_date: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                  Select time
                </label>
                <input
                  type='time'
                  required
                  className='w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none transition'
                  value={form.booking_time}
                  onChange={(e) =>
                    setForm({ ...form, booking_time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className='block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5'>
                Describe your issue{' '}
                <span className='text-slate-400 normal-case font-normal'>
                  (optional)
                </span>
              </label>
              <textarea
                rows={4}
                placeholder='Briefly describe your legal situation so the lawyer can prepare for the consultation…'
                className='w-full border border-slate-200 rounded-lg px-4 py-3 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none transition'
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <p className='text-[12px] text-slate-400 mt-1.5 flex items-center gap-1'>
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
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                This helps the lawyer understand your case better
              </p>
            </div>

            {/* Footer */}
            <div className='border-t border-slate-100 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <p className='text-[11px] text-slate-400 uppercase tracking-wide'>
                  Total amount
                </p>
                <p className='text-[28px] font-medium text-slate-900 leading-none mt-1'>
                  ₹{service.price}
                </p>
                <p className='text-[11px] text-slate-400 mt-1'>
                  Inclusive of all taxes
                </p>
              </div>
              <button
                type='submit'
                disabled={loading}
                className='flex items-center justify-center gap-2 text-[13px] font-medium text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                style={{ background: '#185FA5' }}
                onMouseOver={(e) =>
                  !loading && (e.currentTarget.style.background = '#0C447C')
                }
                onMouseOut={(e) =>
                  !loading && (e.currentTarget.style.background = '#185FA5')
                }
              >
                {loading ? (
                  <>
                    <svg
                      className='w-4 h-4 animate-spin'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    Confirm booking
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-[12px] text-slate-400'>
            Need help?{' '}
            <a
              href='#'
              className='text-slate-600 hover:text-slate-800 underline underline-offset-2'
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
