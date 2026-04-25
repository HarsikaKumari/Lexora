import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

// ─── Template config — mirrors backend exactly ───────────────────────────────
const TEMPLATES = {
  affidavit: {
    label: 'Affidavit',
    description:
      'A sworn written statement used as evidence in legal proceedings',
    iconBg: '#E6F1FB',
    iconColor: '#185FA5',
    fields: [
      { key: 'client_name', label: 'Your full name', placeholder: 'Rahul Sharma', type: 'text', required: true },
      { key: 'address', label: 'Your address', placeholder: '123 MG Road, Mumbai', type: 'text', required: true },
      { key: 'statement_1', label: 'Statement 1', placeholder: 'I am the legal owner of…', type: 'textarea', required: true },
      { key: 'statement_2', label: 'Statement 2', placeholder: 'I have not transferred…', type: 'textarea', required: true },
      { key: 'city', label: 'City', placeholder: 'Mumbai', type: 'text', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date', required: true },
    ],
  },
  contract: {
    label: 'Legal Contract',
    description: 'A legally binding agreement between two or more parties',
    iconBg: '#EEEDFE',
    iconColor: '#534AB7',
    fields: [
      { key: 'party_a_name', label: 'Party A — Name', placeholder: 'Rahul Sharma', type: 'text', required: true },
      { key: 'party_a_address', label: 'Party A — Address', placeholder: '123 MG Road, Mumbai', type: 'text', required: true },
      { key: 'party_b_name', label: 'Party B — Name', placeholder: 'Priya Mehta', type: 'text', required: true },
      { key: 'party_b_address', label: 'Party B — Address', placeholder: '456 Park St, Delhi', type: 'text', required: true },
      { key: 'term_1', label: 'Term 1', placeholder: 'Payment of ₹50,000…', type: 'textarea', required: true },
      { key: 'term_2', label: 'Term 2', placeholder: 'Services to be done by…', type: 'textarea', required: true },
      { key: 'term_3', label: 'Term 3', placeholder: 'Both parties agree to…', type: 'textarea', required: true },
      { key: 'date', label: 'Agreement date', placeholder: '', type: 'date', required: true },
    ],
  },
  divorce_petition: {
    label: 'Divorce Petition',
    description: 'Legal document filed to initiate divorce proceedings',
    iconBg: '#FAEEDA',
    iconColor: '#854F0B',
    fields: [
      { key: 'petitioner_name', label: 'Petitioner name', placeholder: 'Sarah Johnson', type: 'text', required: true },
      { key: 'respondent_name', label: 'Respondent name', placeholder: 'Michael Johnson', type: 'text', required: true },
      { key: 'marriage_date', label: 'Date of marriage', placeholder: '', type: 'date', required: true },
      { key: 'grounds', label: 'Grounds for divorce', placeholder: 'Irreconcilable differences have led…', type: 'textarea', required: true },
      { key: 'relief_requested', label: 'Relief requested', placeholder: 'Dissolution of marriage, equitable…', type: 'textarea', required: true },
      { key: 'date', label: 'Filing date', placeholder: '', type: 'date', required: true },
    ],
  },
};

function FileIcon({ style = {}, className = '' }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

const inp = `w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px]
  text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2
  focus:ring-blue-200 focus:border-blue-400 hover:border-slate-300
  transition-colors`;

export default function DocumentGenerator() {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [formData, setFormData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/my')
      .then((res) => setBookings(res.data.filter((b) => b.status === 'confirmed')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setFormData({});
    setErrors({});
    setPreview('');
    setError('');
  }, [selectedType]);

  const template = TEMPLATES[selectedType];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const validate = () => {
    if (!template) return false;
    const newErrors = {};
    template.fields.forEach((f) => {
      if (f.required && !formData[f.key]?.trim()) newErrors[f.key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPreview = () => {
    if (!TEMPLATES[selectedType]) return '';
    const templateStrings = {
      affidavit: `AFFIDAVIT\n\nI, {{client_name}}, residing at {{address}}, do hereby solemnly affirm and state as follows:\n\n1. {{statement_1}}\n2. {{statement_2}}\n\nVerified on {{date}} at {{city}}.\n\nSignature: _________________\nName: {{client_name}}\nDate: {{date}}`,
      contract: `LEGAL AGREEMENT\n\nThis agreement is entered into on {{date}} between:\n\nParty A: {{party_a_name}}, ({{party_a_address}})\nParty B: {{party_b_name}}, ({{party_b_address}})\n\nTERMS:\n1. {{term_1}}\n2. {{term_2}}\n3. {{term_3}}\n\nBoth parties agree to the terms stated above.\n\nParty A Signature: _______________ Date: {{date}}\nParty B Signature: _______________ Date: {{date}}`,
      divorce_petition: `PETITION FOR DISSOLUTION OF MARRIAGE\n\nPetitioner: {{petitioner_name}}\nRespondent: {{respondent_name}}\nDate of Marriage: {{marriage_date}}\n\nGrounds for Dissolution:\n{{grounds}}\n\nRelief Requested:\n{{relief_requested}}\n\nFiled on: {{date}}\nPetitioner Signature: _______________`,
    };
    let content = templateStrings[selectedType] || '';
    Object.entries(formData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    return content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        document_type: selectedType,
        template_data: formData,
        ...(selectedBooking && { booking_id: Number(selectedBooking) }),
      };
      const res = await api.post('/documents/generate', payload);
      navigate(`/documents/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Document generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Choose document type ──────────────────────────────────────────
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Hero — matches DocumentsPage */}
        <div className="relative overflow-hidden px-7 py-9" style={{ background: '#185FA5' }}>
          <div className="absolute rounded-full" style={{ width: 220, height: 220, background: 'rgba(255,255,255,0.06)', right: -40, top: -60 }} />
          <div className="absolute rounded-full" style={{ width: 160, height: 160, background: 'rgba(255,255,255,0.04)', right: 80, bottom: -80 }} />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-medium text-white tracking-tight">Generate a document</h1>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Choose the type of legal document you need to create
              </p>
            </div>
            <button
              onClick={() => navigate('/documents')}
              className="flex items-center gap-2 bg-white font-medium text-[13px] px-4 py-2.5 rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors"
              style={{ color: '#0C447C' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              My documents
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-7 py-6">
          <div className="space-y-2">
            {Object.entries(TEMPLATES).map(([type, tmpl]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-blue-200 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tmpl.iconBg }}>
                  <FileIcon className="w-4 h-4" style={{ stroke: tmpl.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-900 mb-0.5">{tmpl.label}</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{tmpl.description}</p>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Fill form ──────────────────────────────────────────────────────
  const meta = TEMPLATES[selectedType];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden px-7 py-9" style={{ background: '#185FA5' }}>
        <div className="absolute rounded-full" style={{ width: 220, height: 220, background: 'rgba(255,255,255,0.06)', right: -40, top: -60 }} />
        <div className="absolute rounded-full" style={{ width: 160, height: 160, background: 'rgba(255,255,255,0.04)', right: 80, bottom: -80 }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-medium text-white tracking-tight">{meta.label}</h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {meta.description}
            </p>
          </div>
          <button
            onClick={() => setSelectedType('')}
            className="flex items-center gap-2 bg-white font-medium text-[13px] px-4 py-2.5 rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors"
            style={{ color: '#0C447C' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change type
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-7 py-6">
        <div className="grid lg:grid-cols-2 gap-4">

          {/* ── LEFT: Form ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {bookings.length > 0 && (
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Link to a booking <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select className={inp} value={selectedBooking} onChange={(e) => setSelectedBooking(e.target.value)}>
                    <option value="">— No booking —</option>
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} — {new Date(b.booking_date || b.bookingDate).toLocaleDateString('en-IN')}
                      </option>
                    ))}
                  </select>
                  <div className="border-t border-slate-100 mt-3.5" />
                </div>
              )}

              {template.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      className={`${inp} resize-none ${errors[field.key] ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`${inp} ${errors[field.key] ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                  {errors[field.key] && (
                    <p className="text-[11px] text-red-500 mt-1">This field is required</p>
                  )}
                </div>
              ))}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPreview(buildPreview())}
                  className="flex-1 text-[12px] font-medium border border-slate-200 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-[12px] font-medium px-3 py-2.5 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#185FA5' }}
                >
                  {loading ? 'Generating…' : 'Generate document'}
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-6">
              {/* Preview header */}
              <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: meta.iconBg }}>
                    <FileIcon className="w-4 h-4" style={{ stroke: meta.iconColor }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-slate-700">{meta.label}</p>
                    <p className="text-[11px] text-slate-400">{meta.label.toLowerCase().replace(' ', '_')}.txt</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreview(buildPreview())}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="p-5 min-h-80 max-h-[560px] overflow-y-auto">
                {preview ? (
                  <pre className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap font-mono">
                    {preview}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 text-center">
                    <div className="rounded-full flex items-center justify-center mx-auto mb-3" style={{ width: 44, height: 44, background: meta.iconBg }}>
                      <FileIcon className="w-5 h-5" style={{ stroke: meta.iconColor }} />
                    </div>
                    <p className="text-[13px] font-medium text-slate-500">Document preview</p>
                    <p className="text-[12px] text-slate-400 mt-1">
                      Fill in the fields and click{' '}
                      <span className="font-medium text-slate-500">Preview</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}