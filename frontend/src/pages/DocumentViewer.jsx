import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const DOC_META = {
  affidavit: {
    label: 'Affidavit',
    iconBg: '#E6F1FB',
    iconColor: '#185FA5',
  },
  contract: {
    label: 'Legal Contract',
    iconBg: '#EEEDFE',
    iconColor: '#534AB7',
  },
  divorce_petition: {
    label: 'Divorce Petition',
    iconBg: '#FAEEDA',
    iconColor: '#854F0B',
  },
};

const STATUS_STYLE = {
  generated: { bg: '#EAF3DE', color: '#3B6D11' },
  updated: { bg: '#E6F1FB', color: '#185FA5' },
  draft: { bg: '#FAEEDA', color: '#854F0B' },
};

const FIELD_LABELS = {
  affidavit: [
    { key: 'client_name', label: 'Your full name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'statement_1', label: 'Statement 1', type: 'textarea' },
    { key: 'statement_2', label: 'Statement 2', type: 'textarea' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
  ],
  contract: [
    { key: 'party_a_name', label: 'Party A — Name', type: 'text' },
    { key: 'party_a_address', label: 'Party A — Address', type: 'text' },
    { key: 'party_b_name', label: 'Party B — Name', type: 'text' },
    { key: 'party_b_address', label: 'Party B — Address', type: 'text' },
    { key: 'term_1', label: 'Term 1', type: 'textarea' },
    { key: 'term_2', label: 'Term 2', type: 'textarea' },
    { key: 'term_3', label: 'Term 3', type: 'textarea' },
    { key: 'date', label: 'Agreement date', type: 'date' },
  ],
  divorce_petition: [
    { key: 'petitioner_name', label: 'Petitioner name', type: 'text' },
    { key: 'respondent_name', label: 'Respondent name', type: 'text' },
    { key: 'marriage_date', label: 'Date of marriage', type: 'date' },
    { key: 'grounds', label: 'Grounds for divorce', type: 'textarea' },
    { key: 'relief_requested', label: 'Relief requested', type: 'textarea' },
    { key: 'date', label: 'Filing date', type: 'date' },
  ],
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

const inp = `w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px]
  text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2
  focus:ring-blue-200 focus:border-blue-400 hover:border-slate-300 transition-colors`;

export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    api
      .get(`/documents/${id}`)
      .then((res) => {
        setDoc(res.data);
        setEditData(res.data.template_data || {});
      })
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.generated_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob', // ← tells axios to return raw binary/text
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${doc.document_type?.replace(/_/g, '-')}-${id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed. Please try again.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      const res = await api.put(`/documents/${id}`, {
        template_data: editData,
      });
      setDoc((prev) => ({
        ...prev,
        generated_content: res.data.content,
        template_data: editData,
        status: res.data.document.status,
      }));
      setSaveMsg('Document updated successfully.');
      setEditMode(false);
    } catch (err) {
      setSaveErr(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // ── Loading ──
  if (loading)
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div
            className='w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-3 animate-spin'
            style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}
          />
          <p className='text-[13px] text-slate-400'>Loading document…</p>
        </div>
      </div>
    );

  // ── Not found ──
  if (!doc)
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-[13px] text-slate-500 mb-4'>
            Document not found or access denied.
          </p>
          <Link
            to='/documents'
            className='text-[13px] font-medium'
            style={{ color: '#185FA5' }}
          >
            Back to documents
          </Link>
        </div>
      </div>
    );

  const meta = DOC_META[doc.document_type] || {
    label: doc.document_type?.replace(/_/g, ' '),
    iconBg: '#E6F1FB',
    iconColor: '#185FA5',
  };
  const fields = FIELD_LABELS[doc.document_type] || [];
  const st = STATUS_STYLE[doc.status] || { bg: '#f1f5f9', color: '#475569' };

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
          <div className='flex items-center gap-3'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <FileIcon
                className='w-5 h-5'
                style={{ stroke: '#fff' }}
              />
            </div>
            <div>
              <div className='flex items-center gap-2 flex-wrap'>
                <h1 className='text-[22px] font-medium text-white tracking-tight'>
                  {meta.label}
                </h1>
                <span
                  className='text-[11px] px-2 py-0.5 rounded-full font-medium'
                  style={{ background: st.bg, color: st.color }}
                >
                  {doc.status}
                </span>
              </div>
              <div
                className='flex flex-wrap gap-2 mt-1 text-[12px]'
                style={{ color: 'rgba(255,255,255,0.60)' }}
              >
                <span>Doc #{doc.id}</span>
                <span>·</span>
                <span>Generated {formatDate(doc.created_at)}</span>
                {doc.updated_at !== doc.created_at && (
                  <>
                    <span>·</span>
                    <span>Updated {formatDate(doc.updated_at)}</span>
                  </>
                )}
                {doc.client && (
                  <>
                    <span>·</span>
                    <span>{doc.client.name}</span>
                  </>
                )}
              </div>
              {doc.booking?.service && (
                <p
                  className='text-[11px] mt-0.5'
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  Linked: {doc.booking.service.title}
                  {doc.booking.service.lawyer &&
                    ` — ${doc.booking.service.lawyer.name}`}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-2 flex-shrink-0 flex-wrap'>
            <button
              onClick={() => navigate('/documents')}
              className='flex items-center gap-1.5 bg-white font-medium text-[12px] px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors'
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
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back
            </button>
            <button
              onClick={handleCopy}
              className='text-[12px] font-medium px-3 py-2 rounded-lg border transition-colors'
              style={
                copied
                  ? {
                      background: '#EAF3DE',
                      borderColor: '#A8D080',
                      color: '#3B6D11',
                    }
                  : {
                      background: 'rgba(255,255,255,0.12)',
                      borderColor: 'rgba(255,255,255,0.25)',
                      color: '#fff',
                    }
              }
            >
              {copied ? '✓ Copied' : 'Copy text'}
            </button>
            <button
              onClick={handleDownload}
              className='text-[12px] font-medium px-3 py-2 rounded-lg transition-colors'
              style={{ background: '#fff', color: '#0C447C' }}
            >
              Download
            </button>
            <button
              onClick={() => {
                setEditMode(!editMode);
                setSaveMsg('');
                setSaveErr('');
              }}
              className='text-[12px] font-medium px-3 py-2 rounded-lg border transition-colors'
              style={
                editMode
                  ? {
                      background: '#FAEEDA',
                      borderColor: '#E8C080',
                      color: '#854F0B',
                    }
                  : {
                      background: 'rgba(255,255,255,0.12)',
                      borderColor: 'rgba(255,255,255,0.25)',
                      color: '#fff',
                    }
              }
            >
              {editMode ? 'Cancel edit' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-7 py-6'>
        {/* Messages */}
        {saveMsg && (
          <div
            className='border text-[12px] px-4 py-3 rounded-lg mb-4'
            style={{
              background: '#EAF3DE',
              borderColor: '#A8D080',
              color: '#3B6D11',
            }}
          >
            {saveMsg}
          </div>
        )}
        {saveErr && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg mb-4'>
            {saveErr}
          </div>
        )}

        <div
          className={`grid gap-4 ${editMode ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* ── Edit panel ── */}
          {editMode && (
            <div className='bg-white border border-slate-200 rounded-xl p-5'>
              <div className='flex items-center gap-2 mb-4'>
                <div
                  className='w-7 h-7 rounded-lg flex items-center justify-center'
                  style={{ background: meta.iconBg }}
                >
                  <FileIcon
                    className='w-3.5 h-3.5'
                    style={{ stroke: meta.iconColor }}
                  />
                </div>
                <p className='text-[13px] font-medium text-slate-700'>
                  Edit fields
                </p>
              </div>
              <div className='space-y-3.5'>
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className='block text-[12px] font-medium text-slate-600 mb-1.5'>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        className={`${inp} resize-none`}
                        value={editData[field.key] || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        type={field.type}
                        className={inp}
                        value={editData[field.key] || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className='w-full mt-4 text-[13px] font-medium py-2.5 rounded-lg text-white transition-colors disabled:opacity-50'
                style={{ background: '#185FA5' }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )}

          {/* ── Document viewer ── */}
          <div className='bg-white border border-slate-200 rounded-xl overflow-hidden'>
            {/* Header bar */}
            <div className='border-b border-slate-100 px-5 py-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className='w-7 h-7 rounded-lg flex items-center justify-center'
                  style={{ background: meta.iconBg }}
                >
                  <FileIcon
                    className='w-3.5 h-3.5'
                    style={{ stroke: meta.iconColor }}
                  />
                </div>
                <div>
                  <p className='text-[12px] font-medium text-slate-700'>
                    {meta.label}
                  </p>
                  <p className='text-[11px] text-slate-400'>
                    {doc.document_type?.replace(/_/g, '-')}-{doc.id}.txt
                  </p>
                </div>
              </div>
              <span className='text-[11px] text-slate-400'>
                {doc.generated_content?.split('\n').length} lines
              </span>
            </div>

            <div className='p-6 max-h-[640px] overflow-y-auto'>
              <pre className='text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap font-mono'>
                {doc.generated_content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
