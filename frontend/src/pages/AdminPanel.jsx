import { useState, useEffect } from 'react';
import api from '../api/axios';

const statCards = [
  { label: 'Total users', key: 'total_users', color: 'text-slate-900' },
  { label: 'Total services', key: 'total_services', color: 'text-slate-900' },
  { label: 'Total bookings', key: 'total_bookings', color: 'text-slate-900' },
];

const roleBadge = {
  lawyer: 'bg-purple-50 text-purple-700',
  admin: 'bg-amber-50 text-amber-700',
  client: 'bg-blue-50 text-blue-700',
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
    <div className='max-w-6xl mx-auto px-6 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-xl font-semibold text-slate-900'>Admin Panel</h1>
        <p className='text-sm text-slate-500 mt-0.5'>
          Manage users, verifications, and platform activity
        </p>
      </div>

      {/* Pending alert */}
      {pendingLawyers > 0 && (
        <div className='bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between'>
          <p className='text-sm text-amber-800'>
            <span className='font-medium'>
              {pendingLawyers} lawyer{pendingLawyers > 1 ? 's' : ''}
            </span>{' '}
            waiting for verification
          </p>
          <button
            onClick={() => setFilter('lawyer')}
            className='text-xs text-amber-700 font-medium hover:underline'
          >
            Review now →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className='grid grid-cols-3 gap-3 mb-8'>
        {statCards.map((s) => (
          <div
            key={s.label}
            className='bg-slate-50 border border-slate-200 rounded-xl p-5'
          >
            <p className={`text-3xl font-semibold ${s.color}`}>
              {stats[s.key] || 0}
            </p>
            <p className='text-xs text-slate-500 mt-1'>{s.label}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className='bg-white border border-slate-200 rounded-xl overflow-hidden'>
        {/* Table toolbar */}
        <div className='px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
          <h2 className='text-sm font-semibold text-slate-900'>Users</h2>
          <div className='flex items-center gap-2'>
            <input
              placeholder='Search by name or email…'
              className='border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition w-48'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className='flex gap-1'>
              {['all', 'client', 'lawyer'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    filter === f
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              <tr className='border-b border-slate-100'>
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
                    className='text-left px-5 py-3 text-xs font-medium text-slate-500'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-5 py-10 text-center text-slate-400 text-xs'
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className='hover:bg-slate-50 transition-colors'
                  >
                    <td className='px-5 py-3.5'>
                      <div className='flex items-center gap-2.5'>
                        <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0'>
                          <span className='text-xs font-medium text-slate-600'>
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className='text-slate-900 font-medium truncate text-xs'>
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className='px-5 py-3.5 text-slate-500 text-xs truncate'>
                      {u.email}
                    </td>
                    <td className='px-5 py-3.5'>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[u.role] || 'bg-slate-100 text-slate-600'}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className='px-5 py-3.5 text-slate-400 text-xs truncate'>
                      {u.unique_identifier || '—'}
                    </td>
                    <td className='px-5 py-3.5'>
                      {u.is_verified ? (
                        <span className='text-xs flex items-center gap-1 text-green-700'>
                          <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block' />
                          Verified
                        </span>
                      ) : (
                        <span className='text-xs flex items-center gap-1 text-amber-600'>
                          <span className='w-1.5 h-1.5 rounded-full bg-amber-400 inline-block' />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className='px-5 py-3.5'>
                      {u.role === 'lawyer' && (
                        <button
                          onClick={() => toggleVerify(u.id, u.is_verified)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            u.is_verified
                              ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                              : 'bg-slate-900 text-white hover:bg-slate-700'
                          }`}
                        >
                          {u.is_verified ? 'Revoke' : 'Verify'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='px-5 py-3 border-t border-slate-100 bg-slate-50'>
          <p className='text-xs text-slate-400'>
            {filtered.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}
