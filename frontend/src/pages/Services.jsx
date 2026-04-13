import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LEGAL_ISSUES = [
  'divorce',
  'property',
  'criminal',
  'corporate',
  'family',
  'civil',
  'tax',
];
const DOC_TYPES = [
  'affidavit',
  'contract',
  'divorce_petition',
  'will',
  'power_of_attorney',
];

const issueBadge = {
  divorce: 'bg-pink-50 text-pink-700',
  property: 'bg-amber-50 text-amber-700',
  criminal: 'bg-red-50 text-red-700',
  corporate: 'bg-blue-50 text-blue-700',
  family: 'bg-purple-50 text-purple-700',
  civil: 'bg-teal-50 text-teal-700',
  tax: 'bg-green-50 text-green-700',
};

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
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-6 py-10'>
      {/* Page header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-slate-900'>
          Legal Services
        </h1>
        <p className='text-slate-500 text-sm mt-1'>
          Find and book verified legal professionals across India
        </p>
      </div>

      {/* Filter bar */}
      <div className='bg-white border border-slate-200 rounded-xl p-4 mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          <input
            placeholder='Search by keyword...'
            className='border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className='border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
            value={filters.legal_issue}
            onChange={(e) =>
              setFilters({ ...filters, legal_issue: e.target.value })
            }
          >
            <option value=''>All legal issues</option>
            {LEGAL_ISSUES.map((i) => (
              <option
                key={i}
                value={i}
              >
                {i.charAt(0).toUpperCase() + i.slice(1)}
              </option>
            ))}
          </select>
          <select
            className='border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
            value={filters.document_type}
            onChange={(e) =>
              setFilters({ ...filters, document_type: e.target.value })
            }
          >
            <option value=''>All document types</option>
            {DOC_TYPES.map((d) => (
              <option
                key={d}
                value={d}
              >
                {d.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <div className='flex gap-2'>
            <input
              placeholder='City or region'
              className='flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition'
              value={filters.region}
              onChange={(e) =>
                setFilters({ ...filters, region: e.target.value })
              }
            />
            <button
              onClick={fetchServices}
              className='bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors whitespace-nowrap'
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className='text-center py-20 text-slate-400 text-sm'>
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-slate-400 text-sm'>
            No services found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <p className='text-xs text-slate-400 mb-4'>
            {services.length} service{services.length !== 1 ? 's' : ''} found
          </p>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {services.map((s) => (
              <div
                key={s.id}
                className='bg-white border border-slate-200 rounded-xl p-5 flex flex-col hover:border-slate-300 transition-colors'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='min-w-0'>
                    <h3 className='font-medium text-slate-900 text-sm leading-snug truncate'>
                      {s.title}
                    </h3>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      {s.lawyer_name}
                    </p>
                  </div>
                  <span className='text-sm font-semibold text-slate-900 whitespace-nowrap'>
                    ₹{s.price}
                  </span>
                </div>

                <p className='text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2'>
                  {s.description}
                </p>

                <div className='flex flex-wrap gap-1.5 mb-4'>
                  {s.legal_issue && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${issueBadge[s.legal_issue] || 'bg-slate-100 text-slate-600'}`}
                    >
                      {s.legal_issue}
                    </span>
                  )}
                  {s.document_type && (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>
                      {s.document_type.replace(/_/g, ' ')}
                    </span>
                  )}
                  {s.region && (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>
                      {s.region}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    user ? navigate(`/book/${s.id}`) : navigate('/login')
                  }
                  className='w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors'
                >
                  Book consultation
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
