import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const benefits = [
  'Bar-council verified legal professionals only',
  'Secure & confidential consultations',
  'Instant legal document generation',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    unique_identifier: '',
    region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'lawyer' ? '/lawyer' : '/client');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-white border border-slate-300 rounded-lg px-4 py-3
    text-sm text-slate-900 placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    hover:border-slate-400 transition-colors`;

  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className='flex flex-col-reverse lg:flex-row h-screen w-full overflow-hidden'>
      {/* ── LEFT — Branding ── */}
      <div
        className='lg:w-1/2 flex flex-col justify-between px-12 py-14'
        style={{
          background:
            'linear-gradient(160deg, #0b1d3a 0%, #0f2d5e 60%, #1a3f7c 100%)',
        }}
      >
        {/* Logo */}
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
            </svg>
          </div>
          <span className='text-white font-semibold text-base tracking-tight'>
            LegalConnect
          </span>
        </div>

        {/* Hero */}
        <div className='max-w-sm'>
          <p className='text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4'>
            Join LegalConnect
          </p>
          <h1 className='text-white text-4xl font-bold leading-snug tracking-tight mb-5'>
            Justice starts <span className='text-blue-400'>with one step.</span>
          </h1>
          <p className='text-slate-400 text-sm leading-relaxed mb-10'>
            Join thousands of clients and lawyers already using LegalConnect for
            smarter, faster legal services.
          </p>

          <ul className='space-y-4'>
            {benefits.map((b) => (
              <li
                key={b}
                className='flex items-start gap-3'
              >
                <div className='mt-1 w-4 h-4 flex-shrink-0 flex items-center justify-center'>
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#60a5fa'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                </div>
                <span className='text-slate-300 text-sm leading-relaxed'>
                  {b}
                </span>
              </li>
            ))}
          </ul>

          {/* Role highlight cards */}
          <div className='mt-10 grid grid-cols-2 gap-3'>
            {[
              {
                label: 'For clients',
                desc: 'Book consultations & get documents',
              },
              {
                label: 'For lawyers',
                desc: 'Manage services & grow your practice',
              },
            ].map((c) => (
              <div
                key={c.label}
                className='rounded-xl px-4 py-4 border border-slate-700 bg-white/5'
              >
                <p className='text-white text-xs font-semibold mb-1'>
                  {c.label}
                </p>
                <p className='text-slate-500 text-xs leading-relaxed'>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className='text-slate-600 text-xs'>
          © 2025 LegalConnect Technologies Pvt. Ltd.
        </p>
      </div>

      {/* ── RIGHT — Form ── */}
      <div className='lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-10 overflow-y-auto'>
        <div className='w-full max-w-md'>
          {/* Heading */}
          <div className='mb-7'>
            <h2 className='text-2xl font-bold text-slate-900 tracking-tight mb-1.5'>
              Create your account
            </h2>
            <p className='text-slate-500 text-sm'>
              Join LegalConnect — free to get started.
            </p>
          </div>

          {/* Role toggle */}
          <div className='flex bg-slate-200 rounded-lg p-1 gap-1 mb-7'>
            {[
              { value: 'client', label: 'Client' },
              { value: 'lawyer', label: 'Professional' },
            ].map((opt) => (
              <button
                key={opt.value}
                type='button'
                onClick={() => setForm({ ...form, role: opt.value })}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  form.role === opt.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className='bg-red-50 border border-red-200 text-red-600 text-sm
              px-4 py-3 rounded-lg mb-5'
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type='text'
                required
                placeholder='Rahul Sharma'
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Email address</label>
              <input
                type='email'
                required
                placeholder='you@example.com'
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type='password'
                  required
                  placeholder='••••••••'
                  className={inputClass}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Confirm password</label>
                <input
                  type='password'
                  required
                  placeholder='••••••••'
                  className={inputClass}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>City / Region</label>
              <input
                type='text'
                placeholder='Mumbai, Delhi…'
                className={inputClass}
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>

            {form.role === 'lawyer' && (
              <>
                <div>
                  <label className={labelClass}>
                    Bar Council ID / License number
                  </label>
                  <input
                    type='text'
                    placeholder='e.g. BAR-MH-2024-001'
                    className={inputClass}
                    value={form.unique_identifier}
                    onChange={(e) =>
                      setForm({ ...form, unique_identifier: e.target.value })
                    }
                  />
                </div>
                <div className='bg-amber-50 border border-amber-200 rounded-lg px-4 py-3'>
                  <p className='text-amber-700 text-xs leading-relaxed'>
                    Your account will be reviewed by an admin before activation.
                    You'll be notified once verified.
                  </p>
                </div>
              </>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white font-semibold py-3 rounded-lg text-sm
                transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-1'
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className='text-center text-sm text-slate-500 mt-6'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 font-semibold hover:text-blue-800 transition-colors'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
