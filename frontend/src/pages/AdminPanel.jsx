import { useState, useEffect } from 'react';
import api from '../api/axios';

const roleBadge = {
  lawyer: { bg: '#EEEDFE', color: '#534AB7' },
  admin: { bg: '#FAEEDA', color: '#854F0B' },
  client: { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data));
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  const toggleVerify = async (id, current) => {
    const res = await api.patch(`/admin/users/${id}/verify`, {
      is_verified: !current,
    });
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, is_verified: res.data.is_verified } : u,
      ),
    );
  };

  const filtered = users
    .filter((u) => filter === 'all' || u.role === filter)
    .filter(
      (u) =>
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  const pendingLawyers = users.filter(
    (u) => u.role === 'lawyer' && !u.is_verified,
  ).length;

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
        <div className='relative'>
          <h1 className='text-[26px] font-medium text-white tracking-tight'>
            Admin panel
          </h1>
          <p
            className='text-[13px] mt-1'
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Manage users, verifications, and platform activity
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className='grid grid-cols-3 bg-white border-b border-slate-200'>
        {[
          {
            label: 'Total users',
            value: stats.total_users || 0,
            hint: 'Registered accounts',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
              />
            ),
          },
          {
            label: 'Total services',
            value: stats.total_services || 0,
            hint: 'Live listings',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-700',
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
            value: stats.total_bookings || 0,
            hint: 'All time',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-700',
            icon: (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
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

      <div className='max-w-6xl mx-auto px-7 py-6'>
        {/* Pending alert */}
        {pendingLawyers > 0 && (
          <div
            className='flex items-center justify-between px-4 py-3 rounded-xl mb-6 border'
            style={{ background: '#FAEEDA', borderColor: '#FAC775' }}
          >
            <div className='flex items-center gap-2.5'>
              <div
                className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
                style={{ background: 'rgba(239,159,39,0.2)' }}
              >
                <svg
                  className='w-3.5 h-3.5'
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
              <p
                className='text-[13px]'
                style={{ color: '#633806' }}
              >
                <span className='font-medium'>
                  {pendingLawyers} lawyer{pendingLawyers > 1 ? 's' : ''}
                </span>{' '}
                waiting for verification
              </p>
            </div>
            <button
              onClick={() => setFilter('lawyer')}
              className='text-[12px] font-medium hover:underline'
              style={{ color: '#854F0B' }}
            >
              Review now →
            </button>
          </div>
        )}

        {/* Users table */}
        <div className='bg-white border border-slate-200 rounded-xl overflow-hidden'>
          {/* Toolbar */}
          <div className='px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className='w-1 h-5 rounded-full'
                style={{ background: '#185FA5' }}
              />
              <h2 className='text-[14px] font-medium text-slate-900'>Users</h2>
              <span
                className='text-[11px] font-medium px-2 py-0.5 rounded-full ml-1'
                style={{ background: '#E6F1FB', color: '#185FA5' }}
              >
                {filtered.length}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                placeholder='Search by name or email…'
                className='border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none w-52 transition'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className='flex gap-1'>
                {['all', 'client', 'lawyer'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className='text-[12px] px-3 py-2 rounded-lg capitalize transition-colors font-medium'
                    style={
                      filter === f
                        ? {
                            background: '#185FA5',
                            color: '#fff',
                            border: 'none',
                          }
                        : {
                            background: 'transparent',
                            color: '#64748b',
                            border: '0.5px solid #e2e8f0',
                          }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table
              className='w-full text-sm'
              style={{ tableLayout: 'fixed' }}
            >
              <colgroup>
                <col style={{ width: '22%' }} />
                <col style={{ width: '26%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                  {[
                    'Name',
                    'Email',
                    'Role',
                    'License ID',
                    'Status',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className='text-left px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide'
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-5 py-14 text-center text-[13px] text-slate-400'
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => {
                    const badge = roleBadge[u.role] || {
                      bg: '#f1f5f9',
                      color: '#475569',
                    };
                    return (
                      <tr
                        key={u.id}
                        className='hover:bg-slate-50 transition-colors'
                        style={{ borderBottom: '0.5px solid #f1f5f9' }}
                      >
                        <td className='px-5 py-3.5'>
                          <div className='flex items-center gap-2.5'>
                            <div
                              className='w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-medium'
                              style={{
                                background: '#E6F1FB',
                                color: '#185FA5',
                              }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className='text-[12px] font-medium text-slate-900 truncate'>
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className='px-5 py-3.5 text-[12px] text-slate-500 truncate'>
                          {u.email}
                        </td>
                        <td className='px-5 py-3.5'>
                          <span
                            className='text-[11px] px-2 py-0.5 rounded-full font-medium'
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className='px-5 py-3.5 text-[12px] text-slate-400 truncate'>
                          {u.unique_identifier || '—'}
                        </td>
                        <td className='px-5 py-3.5'>
                          {u.is_verified ? (
                            <span
                              className='flex items-center gap-1.5 text-[12px]'
                              style={{ color: '#3B6D11' }}
                            >
                              <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block' />
                              Verified
                            </span>
                          ) : (
                            <span
                              className='flex items-center gap-1.5 text-[12px]'
                              style={{ color: '#854F0B' }}
                            >
                              <span className='w-1.5 h-1.5 rounded-full bg-amber-400 inline-block' />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className='px-5 py-3.5'>
                          {u.role === 'lawyer' && (
                            <button
                              onClick={() => toggleVerify(u.id, u.is_verified)}
                              className='text-[12px] px-3 py-1.5 rounded-lg font-medium transition-colors'
                              style={
                                u.is_verified
                                  ? {
                                      background: 'transparent',
                                      color: '#64748b',
                                      border: '0.5px solid #e2e8f0',
                                    }
                                  : {
                                      background: '#185FA5',
                                      color: '#fff',
                                      border: 'none',
                                    }
                              }
                            >
                              {u.is_verified ? 'Revoke' : 'Verify'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className='px-5 py-3 flex items-center justify-between'
            style={{ borderTop: '0.5px solid #f1f5f9', background: '#f8fafc' }}
          >
            <p className='text-[12px] text-slate-400'>
              Showing{' '}
              <span className='font-medium text-slate-600'>
                {filtered.length}
              </span>{' '}
              of{' '}
              <span className='font-medium text-slate-600'>{users.length}</span>{' '}
              users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
