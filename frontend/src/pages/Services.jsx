import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios"
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

export default function Services() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    legal_issue: '',
    document_type: '',
    region: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v),
      );
      const res = await api.get('/services', { params });
      setServices(res.data.services || []);
    } catch (err) {
      console.error(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // const initials = user?.name
  //   ?.split(' ')
  //   .map((n) => n[0])
  //   .join('')
  //   .slice(0, 2)
  //   .toUpperCase();

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Hero */}
      <div
        className='relative overflow-hidden px-7 py-10'
        style={{ background: '#185FA5' }}
      >
        <div
          className='absolute rounded-full'
          style={{
            width: 260,
            height: 260,
            background: 'rgba(255,255,255,0.05)',
            right: -60,
            top: -80,
          }}
        />
        <div
          className='absolute rounded-full'
          style={{
            width: 180,
            height: 180,
            background: 'rgba(255,255,255,0.04)',
            right: 120,
            bottom: -90,
          }}
        />
        <div className='relative text-center max-w-xl mx-auto'>
          <h1 className='text-[28px] font-medium text-white tracking-tight'>
            Find trusted legal experts
          </h1>
          <p
            className='text-[13px] mt-2'
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Connect with verified lawyers across India and get professional
            legal help instantly.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className='max-w-6xl mx-auto px-7 -mt-5 mb-8 relative z-10'>
        <div className='bg-white border border-slate-200 rounded-xl p-4 shadow-sm'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3'>
            <input
              placeholder='Search services…'
              className='col-span-2 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 text-slate-700 placeholder-slate-400'
              style={{ '--tw-ring-color': '#185FA5' }}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <select
              className='border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none'
              value={filters.legal_issue}
              onChange={(e) =>
                setFilters({ ...filters, legal_issue: e.target.value })
              }
            >
              <option value=''>All issues</option>
              {LEGAL_ISSUES.map((i) => (
                <option
                  key={i}
                  value={i}
                >
                  {i.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <select
              className='border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none'
              value={filters.document_type}
              onChange={(e) =>
                setFilters({ ...filters, document_type: e.target.value })
              }
            >
              <option value=''>All docs</option>
              {DOC_TYPES.map((d) => (
                <option
                  key={d}
                  value={d}
                >
                  {d.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <button
              onClick={fetchServices}
              className='text-[13px] font-medium text-white rounded-lg px-4 py-2.5 transition-colors'
              style={{ background: '#185FA5' }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = '#0C447C')
              }
              onMouseOut={(e) => (e.currentTarget.style.background = '#185FA5')}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className='max-w-6xl mx-auto px-7 pb-12'>
        {loading ? (
          <div className='text-center py-20'>
            <div
              className='w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-3 animate-spin'
              style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}
            />
            <p className='text-[13px] text-slate-400'>Loading services…</p>
          </div>
        ) : services.length === 0 ? (
          <div className='text-center py-20 bg-white border border-slate-200 rounded-xl'>
            <div
              className='rounded-full flex items-center justify-center mx-auto mb-3'
              style={{ width: 52, height: 52, background: '#E6F1FB' }}
            >
              <svg
                className='w-5 h-5'
                style={{ stroke: '#185FA5' }}
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <p className='text-[14px] font-medium text-slate-500'>
              No services found
            </p>
            <p className='text-[13px] text-slate-400 mt-1'>
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <p className='text-[12px] text-slate-400 mb-5 font-medium uppercase tracking-wide'>
              {services.length} service{services.length !== 1 ? 's' : ''} found
            </p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {services.map((s) => (
                <div
                  key={s.id}
                  className='bg-white border border-slate-200 rounded-xl p-5 flex flex-col hover:border-blue-200 transition-colors'
                  style={{ '--hover-border': '#B5D4F4' }}
                >
                  {/* Header */}
                  <div className='flex items-start justify-between gap-3 mb-4'>
                    <div className='flex items-start gap-3 min-w-0'>
                      <div
                        className='w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'
                        style={{ background: '#E6F1FB' }}
                      >
                        <svg
                          className='w-4 h-4'
                          style={{ stroke: '#185FA5' }}
                          fill='none'
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
                        <h3 className='text-[14px] font-medium text-slate-900 leading-snug'>
                          {s.title}
                        </h3>
                        <p className='text-[12px] text-slate-400 mt-0.5'>
                          by{' '}
                          <span className='text-slate-600 font-medium'>
                            {s.lawyer_name}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className='text-[13px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0'
                      style={{ background: '#E6F1FB', color: '#0C447C' }}
                    >
                      ₹{s.price}
                    </div>
                  </div>

                  {/* Description */}
                  {s.description && (
                    <div className='mb-4 bg-slate-50 rounded-lg px-3 py-2.5'>
                      <p className='text-[12px] text-slate-600 line-clamp-2 leading-relaxed'>
                        {s.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className='flex flex-wrap gap-1.5 mb-5'>
                    {s.legal_issue && (
                      <span
                        className='text-[11px] font-medium px-2.5 py-1 rounded-full'
                        style={{ background: '#E6F1FB', color: '#185FA5' }}
                      >
                        {s.legal_issue.replace(/_/g, ' ')}
                      </span>
                    )}
                    {s.document_type && (
                      <span className='text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600'>
                        {s.document_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    {s.region && (
                      <span
                        className='text-[11px] font-medium px-2.5 py-1 rounded-full'
                        style={{ background: '#EAF3DE', color: '#3B6D11' }}
                      >
                        {s.region}
                      </span>
                    )}
                    {s.duration_minutes && (
                      <span className='text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500'>
                        {s.duration_minutes} min
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      user ? navigate(`/book/${s.id}`) : navigate('/login')
                    }
                    className='mt-auto w-full text-[13px] font-medium text-white py-2.5 rounded-lg transition-colors'
                    style={{ background: '#185FA5' }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = '#0C447C')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = '#185FA5')
                    }
                  >
                    Book consultation
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
