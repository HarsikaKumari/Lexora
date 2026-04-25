import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const DOC_META = {
  affidavit: {
    label: 'Affidavit',
    description:
      'A sworn written statement used as evidence in legal proceedings',
    iconBg: '#E6F1FB',
    iconColor: '#185FA5',
  },
  contract: {
    label: 'Legal Contract',
    description: 'A legally binding agreement between two or more parties',
    iconBg: '#EEEDFE',
    iconColor: '#534AB7',
  },
  divorce_petition: {
    label: 'Divorce Petition',
    description: 'Legal document filed to initiate divorce proceedings',
    iconBg: '#FAEEDA',
    iconColor: '#854F0B',
  },
};

const STATUS_STYLE = {
  generated: { bg: '#EAF3DE', color: '#3B6D11' },
  updated: { bg: '#E6F1FB', color: '#185FA5' },
  draft: { bg: '#FAEEDA', color: '#854F0B' },
};

function FileIcon({ style = {}, className = '' }) {
  return (
    <svg
      className={className}
      style={style}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      />
    </svg>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/documents/my')
      .then((res) => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((docs) => docs.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

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
        <div className='relative flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-[26px] font-medium text-white tracking-tight'>
              Legal documents
            </h1>
            <p
              className='text-[13px] mt-1'
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {documents.length > 0
                ? `${documents.length} document${documents.length > 1 ? 's' : ''} generated`
                : 'Generate and manage your legal documents'}
            </p>
          </div>
          <button
            onClick={() => navigate('/documents/generate')}
            className='flex items-center gap-2 bg-white font-medium text-[13px] px-4 py-2.5 rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors'
            style={{ color: '#0C447C' }}
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
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            New document
          </button>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-7 py-6'>
        {/* Quick-start template cards */}
        <div className='grid grid-cols-3 gap-3 mb-8'>
          {Object.entries(DOC_META).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => navigate(`/documents/generate?type=${type}`)}
              className='text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors group'
            >
              <div className='flex items-center gap-2.5 mb-3'>
                <div
                  className='w-8 h-8 rounded-lg flex items-center justify-center'
                  style={{ background: meta.iconBg }}
                >
                  <FileIcon
                    className='w-4 h-4'
                    style={{ stroke: meta.iconColor }}
                  />
                </div>
                <span className='text-[12px] font-medium text-slate-900'>
                  {meta.label}
                </span>
              </div>
              <p className='text-[12px] text-slate-500 leading-relaxed'>
                {meta.description}
              </p>
              <p
                className='text-[12px] font-medium mt-2'
                style={{ color: '#185FA5' }}
              >
                Generate →
              </p>
            </button>
          ))}
        </div>

        {/* Document list */}
        {loading ? (
          <div className='text-center py-20'>
            <div
              className='w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-3 animate-spin'
              style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}
            />
            <p className='text-[13px] text-slate-400'>Loading documents…</p>
          </div>
        ) : documents.length === 0 ? (
          <div className='text-center py-14 bg-white border border-slate-200 rounded-xl'>
            <div
              className='rounded-full flex items-center justify-center mx-auto mb-3'
              style={{ width: 52, height: 52, background: '#E6F1FB' }}
            >
              <FileIcon
                className='w-5 h-5'
                style={{ stroke: '#185FA5' }}
              />
            </div>
            <p className='text-[14px] font-medium text-slate-500'>
              No documents yet
            </p>
            <p className='text-[13px] text-slate-400 mt-1 mb-5'>
              Generate your first legal document — affidavits, contracts, or
              petitions.
            </p>
            <button
              onClick={() => navigate('/documents/generate')}
              className='text-[13px] font-medium text-white px-5 py-2.5 rounded-lg'
              style={{ background: '#185FA5' }}
            >
              Generate document
            </button>
          </div>
        ) : (
          <div className='space-y-2'>
            {documents.map((doc) => {
              const meta = DOC_META[doc.document_type] || {};
              const st = STATUS_STYLE[doc.status] || {
                bg: '#f1f5f9',
                color: '#475569',
              };
              return (
                <div
                  key={doc.id}
                  className='bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-blue-200 transition-colors'
                >
                  <div
                    className='w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0'
                    style={{ background: meta.iconBg || '#E6F1FB' }}
                  >
                    <FileIcon
                      className='w-4 h-4'
                      style={{ stroke: meta.iconColor || '#185FA5' }}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-0.5'>
                      <p className='text-[13px] font-medium text-slate-900'>
                        {meta.label || doc.document_type?.replace(/_/g, ' ')}
                      </p>
                      <span
                        className='text-[11px] px-2 py-0.5 rounded-full font-medium'
                        style={{ background: st.bg, color: st.color }}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-[12px] text-slate-400'>
                      <span>Doc #{doc.id}</span>
                      <span>·</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.booking?.service?.title && (
                        <>
                          <span>·</span>
                          <span>{doc.booking.service.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 flex-shrink-0'>
                    <Link
                      to={`/documents/${doc.id}`}
                      className='text-[12px] font-medium border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors'
                    >
                      View
                    </Link>
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/documents/${doc.id}/download`}
                      className='text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors'
                      style={{
                        color: '#185FA5',
                        borderColor: '#B5D4F4',
                        background: 'transparent',
                      }}
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className='text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40'
                      style={{
                        color: '#A32D2D',
                        borderColor: '#F5BBBB',
                        background: 'transparent',
                      }}
                    >
                      {deleting === doc.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
