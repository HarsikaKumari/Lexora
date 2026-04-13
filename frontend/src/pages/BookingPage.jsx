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
      <div className='min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm'>
        Loading…
      </div>
    );

  if (success)
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-sm w-full'>
          <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-6 h-6 text-green-600'
              fill='none'
              stroke='currentColor'
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
          <h2 className='text-lg font-semibold text-slate-900 mb-1'>
            Booking confirmed
          </h2>
          <p className='text-sm text-slate-500'>
            Redirecting you to your dashboard…
          </p>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-10'>
      <div className='max-w-lg mx-auto'>
        <Link
          to='/services'
          className='text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6'
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

        {/* Service summary card */}
        <div className='bg-white border border-slate-200 rounded-xl p-4 mb-4 flex items-center justify-between'>
          <div>
            <p className='font-medium text-slate-900 text-sm'>
              {service.title}
            </p>
            <p className='text-xs text-slate-500 mt-0.5'>
              with {service.lawyer_name} · {service.region}
            </p>
          </div>
          <span className='text-base font-semibold text-slate-900'>
            ₹{service.price}
          </span>
        </div>

        {/* Booking form */}
        <div className='bg-white border border-slate-200 rounded-xl p-6'>
          <h1 className='text-base font-semibold text-slate-900 mb-5'>
            Schedule your consultation
          </h1>

          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                  Date
                </label>
                <input
                  type='date'
                  required
                  className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                  value={form.booking_date}
                  onChange={(e) =>
                    setForm({ ...form, booking_date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                  Time
                </label>
                <input
                  type='time'
                  required
                  className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                  value={form.booking_time}
                  onChange={(e) =>
                    setForm({ ...form, booking_time: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-600 mb-1.5'>
                Describe your issue{' '}
                <span className='text-slate-400 font-normal'>(optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder='Briefly describe your legal situation so the lawyer can prepare…'
                className='w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className='pt-2 border-t border-slate-100 flex items-center justify-between'>
              <div>
                <p className='text-xs text-slate-500'>Total</p>
                <p className='text-lg font-semibold text-slate-900'>
                  ₹{service.price}
                </p>
              </div>
              <button
                type='submit'
                disabled={loading}
                className='bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50'
              >
                {loading ? 'Confirming…' : 'Confirm booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
