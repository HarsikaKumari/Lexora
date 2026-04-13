import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hide navbar on auth pages
  const hideOn = ['/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;

  const roleMeta = {
    admin: { label: 'Admin', bg: 'bg-amber-100', text: 'text-amber-800' },
    lawyer: { label: 'Lawyer', bg: 'bg-purple-100', text: 'text-purple-800' },
    client: { label: 'Client', bg: 'bg-blue-100', text: 'text-blue-800' },
  };
  const meta = roleMeta[user?.role] || {};

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm transition-colors ${
        location.pathname === to
          ? 'text-slate-900 font-medium'
          : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className='bg-white border-b border-slate-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 h-14 flex items-center justify-between'>
        <Link
          to='/'
          className='flex items-center gap-2.5'
        >
          <div className='w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center'>
            <span className='text-white text-xs font-bold'>LC</span>
          </div>
          <span className='font-semibold text-slate-900 text-sm'>
            LegalConnect
          </span>
        </Link>

        <nav className='hidden md:flex items-center gap-6'>
          {navLink('/services', 'Browse Services')}
          {user?.role === 'client' && navLink('/client', 'My Dashboard')}
          {user?.role === 'lawyer' && navLink('/lawyer', 'My Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin Panel')}
        </nav>

        <div className='flex items-center gap-3'>
          {user ? (
            <>
              <div className='hidden sm:flex items-center gap-2'>
                <span className='text-sm text-slate-700'>{user.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}
                >
                  {meta.label}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className='text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors'
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='text-sm text-slate-600 hover:text-slate-900 transition-colors'
              >
                Sign in
              </Link>
              <Link
                to='/register'
                className='text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 transition-colors'
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
