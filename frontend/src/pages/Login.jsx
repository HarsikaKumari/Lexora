import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = ['Client', 'Lawyer', 'Admin'];

const features = [
  'Verified & bar-council licensed professionals',
  'End-to-end encrypted consultations',
  'Fast legal document generation',
];

export default function Login() {
  const [role, setRole] = useState('Client');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'lawyer') navigate('/lawyer');
      else navigate('/client');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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
            Legal Consultation Platform
          </p>
          <h1 className='text-white text-4xl font-bold leading-snug tracking-tight mb-5'>
            Expert legal help,{' '}
            <span className='text-blue-400'>when you need it.</span>
          </h1>
          <p className='text-slate-400 text-sm leading-relaxed mb-10'>
            Connect with verified lawyers, manage your cases, and generate legal
            documents — all from one platform.
          </p>

          <ul className='space-y-4'>
            {features.map((f) => (
              <li
                key={f}
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
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className='text-white mt-5 text-xs'>
          test user: harsika8@gmail.com, pass: 123456
        </p>
        <p className='text-slate-600 text-xs'>
          © 2025 LegalConnect Technologies Pvt. Ltd.
        </p>
      </div>

      {/* ── RIGHT — Form ── */}
      <div className='lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-14'>
        <div className='w-full max-w-md'>
          {/* Heading */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-slate-900 tracking-tight mb-1.5'>
              Welcome back
            </h2>
            <p className='text-slate-500 text-sm'>
              Sign in to your LegalConnect account to continue.
            </p>
          </div>

          {/* Role tabs */}
          <div className='flex bg-slate-200 rounded-lg p-1 gap-1 mb-7'>
            {ROLES.map((r) => (
              <button
                key={r}
                type='button'
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${role === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {r}
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
              <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                Email address
              </label>
              <input
                type='email'
                required
                placeholder='you@example.com'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className='w-full bg-white border border-slate-300 rounded-lg px-4 py-3
                  text-sm text-slate-900 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  hover:border-slate-400 transition-colors'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                Password
              </label>
              <input
                type='password'
                required
                placeholder='••••••••'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className='w-full bg-white border border-slate-300 rounded-lg px-4 py-3
                  text-sm text-slate-900 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  hover:border-slate-400 transition-colors'
              />
              <div className='flex justify-end mt-2'>
                <span
                  className='text-xs text-blue-600 hover:text-blue-800
                  cursor-pointer transition-colors'
                >
                  Forgot password?
                </span>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white font-semibold py-3 rounded-lg text-sm
                transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              {loading ? 'Signing in...' : `Sign in as ${role}`}
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-slate-200' />
            <span className='text-xs text-slate-400 select-none'>or</span>
            <div className='flex-1 h-px bg-slate-200' />
          </div>

          <p className='text-center text-sm text-slate-500'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-blue-600 font-semibold hover:text-blue-800 transition-colors'
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
