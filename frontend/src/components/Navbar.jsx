import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideOn = ['/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;

  const roleMeta = {
    admin: { label: 'Admin' },
    lawyer: { label: 'Lawyer' },
    client: { label: 'Client' },
  };

  const meta = roleMeta[user?.role] || {};

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-[13px] px-3 py-1.5 rounded-md transition ${
        location.pathname === to
          ? 'bg-white/20 text-white font-medium'
          : 'text-white/60 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav
      style={{ background: '#0C447C' }}
      className='flex items-center justify-between px-7 h-14 sticky top-0 z-50'
    >
      {/* Logo */}
      <Link
        to='/'
        className='flex items-center gap-3'
      >
        <div
          className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium'
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          LC
        </div>
        <span className='text-white font-medium text-[15px]'>LegalConnect</span>
      </Link>

      {/* Nav Links */}
      <div className='flex gap-1'>
        {navLink('/services', 'Browse services')}

        {user?.role === 'client' && navLink('/documents', 'Documents')}
        {user?.role === 'client' && navLink('/client', 'My dashboard')}
        {user?.role === 'lawyer' && navLink('/lawyer', 'My dashboard')}
        {user?.role === 'admin' && navLink('/admin', 'Admin panel')}
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-2.5'>
        {user ? (
          <>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium'
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {initials}
            </div>

            <span
              className='text-[13px]'
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {user.name}
            </span>

            <span
              className='text-[11px] px-2.5 py-1 rounded-full font-medium text-white'
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              {meta.label}
            </span>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className='text-[12px] px-3 py-1.5 rounded-md border'
              style={{
                color: 'rgba(255,255,255,0.65)',
                borderColor: 'rgba(255,255,255,0.25)',
                background: 'transparent',
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='text-[13px] text-white/70 hover:text-white'
            >
              Sign in
            </Link>
            <Link
              to='/register'
              className='text-[13px] bg-white text-[#0C447C] px-3 py-1.5 rounded-md font-medium hover:bg-slate-100'
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
