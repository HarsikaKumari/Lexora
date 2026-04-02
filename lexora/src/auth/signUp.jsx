import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  blue900: '#042C53',
  blue800: '#0C447C',
  blue600: '#185FA5',
  blue400: '#378ADD',
  blue200: '#85B7EB',
  blue100: '#B5D4F4',
  blue50: '#E6F1FB',
  gray600: '#5F5E5A',
  gray200: '#B4B2A9',
  gray50: '#F1EFE8',
  red600: '#A32D2D',
  red50: '#FCEBEB',
  green600: '#3B6D11',
  green50: '#EAF3DE',
};

// ── Reusable input component ───────────────────────────────────────────────────
const InputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: C.gray600,
          marginBottom: 6,
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: 14,
          border: error
            ? `1.5px solid ${C.red600}`
            : focused
              ? `1.5px solid ${C.blue600}`
              : `0.5px solid ${C.gray200}`,
          borderRadius: 8,
          outline: 'none',
          background: '#fff',
          color: '#111',
          transition: 'border-color .15s',
          fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        }}
      />
      {error && (
        <p style={{ fontSize: 11, color: C.red600, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
};

// ── Trust badge ────────────────────────────────────────────────────────────────
const TrustBadge = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: C.blue400,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 12,
        color: C.blue100,
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      }}
    >
      {text}
    </span>
  </div>
);

// ── Main Login Page ────────────────────────────────────────────────────────────
function SignUpPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.includes('@')) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (!form.firstName) errs.firstName = 'First name is required.';
    if (!form.lastName) errs.lastName = 'Last name is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      }}
    >
      {/* ── Left panel ── */}
      <div
        style={{
          background: C.blue900,
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 22,
            color: '#fff',
            fontFamily: 'Georgia,serif',
            fontWeight: 400,
          }}
        >
          <span style={{ color: C.blue400 }}>Lex</span>ora
        </div>

        {/* Hero */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: C.blue200,
              marginBottom: 18,
            }}
          >
            Legal consultation platform
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.3,
              marginBottom: 16,
              fontFamily: 'Georgia,serif',
            }}
          >
            Expert legal help,
            <br />
            <em style={{ fontStyle: 'italic', color: C.blue200 }}>
              when you need it.
            </em>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: C.blue100,
              lineHeight: 1.75,
              maxWidth: 300,
              marginBottom: 36,
            }}
          >
            Connect with verified lawyers, manage your cases, and generate legal
            documents — all in one place.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TrustBadge text='All lawyers are bar-verified & licensed' />
            <TrustBadge text='End-to-end encrypted consultations' />
            <TrustBadge text='Secure document storage & e-signature' />
            <TrustBadge text='10,000+ clients served across India' />
          </div>
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: C.blue200, opacity: 0.6 }}>
          © 2025 Lexora Legal Technologies Pvt. Ltd.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div
        style={{
          background: '#f7f7f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Heading */}
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#111',
              marginBottom: 6,
              fontFamily: 'Georgia,serif',
            }}
          >
            Welcome to Lexora!
          </h2>
          <p style={{ fontSize: 13, color: C.gray600, marginBottom: 28 }}>
            Sign Up to your Lexora account to continue.
          </p>

          {/* Role selector */}
          <div
            style={{
              display: 'flex',
              background: '#e8e8e5',
              borderRadius: 10,
              padding: 4,
              marginBottom: 24,
              gap: 4,
            }}
          >
            {['client', 'lawyer', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  fontSize: 12,
                  fontWeight: role === r ? 500 : 400,
                  border: 'none',
                  borderRadius: 7,
                  cursor: 'pointer',
                  background: role === r ? '#fff' : 'transparent',
                  color: role === r ? C.blue600 : C.gray600,
                  boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all .15s',
                  textTransform: 'capitalize',
                  fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Success state */}
          {success ? (
            <div
              style={{
                background: C.green50,
                border: `0.5px solid ${C.green600}`,
                borderRadius: 10,
                padding: '16px 18px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>✓</div>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.green600 }}>
                SignUp successful!
              </p>
              <p style={{ fontSize: 12, color: C.gray600, marginTop: 4 }}>
                Redirecting to your {role} dashboard…
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
            >
              <InputField
                label='First Name'
                type='text'
                placeholder='John'
                value={form.firstName}
                onChange={handleChange('firstName')}
                error={errors.firstName}
              />
              <InputField
                label='Last Name'
                type='text'
                placeholder='Doe'
                value={form.lastName}
                onChange={handleChange('lastName')}
                error={errors.lastName}
              />
              <InputField
                label='Email address'
                type='email'
                placeholder='you@example.com'
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
              />

              <InputField
                label='Password'
                type='password'
                placeholder='Enter a strong password'
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />

              {/* Submit button */}
              <button
                type='submit'
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px 0',
                  marginLeft: '14px',
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  background: loading ? C.blue200 : C.blue600,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background .2s',
                  letterSpacing: '0.01em',
                  fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
                }}
              >
                {loading ? 'Creating account…' : `Create account as ${role}`}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  margin: '20px 0',
                }}
              >
                <div
                  style={{ flex: 1, height: '0.5px', background: C.gray200 }}
                />
                <span style={{ fontSize: 11, color: C.gray200 }}>
                  or continue with
                </span>
                <div
                  style={{ flex: 1, height: '0.5px', background: C.gray200 }}
                />
              </div>

              {/* Google sign-up */}
              <button
                type='button'
                style={{
                  width: '100%',
                  padding: '10px 0',
                  fontSize: 13,
                  fontWeight: 500,
                  background: '#fff',
                  color: '#111',
                  border: `0.5px solid ${C.gray200}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
                }}
              >
                {/* Google "G" SVG icon */}
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 48 48'
                >
                  <path
                    fill='#EA4335'
                    d='M24 9.5c3.1 0 5.8 1.1 7.9 2.9l5.9-5.9C34.3 3.2 29.5 1 24 1 14.8 1 7 6.7 3.7 14.6l6.9 5.3C12.3 13.4 17.7 9.5 24 9.5z'
                  />
                  <path
                    fill='#4285F4'
                    d='M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.1 5.1-4.4 6.7l6.8 5.3c4-3.7 6.4-9.2 6.4-16z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6L3.3 14C1.2 18 0 22.4 0 27.1c0 4.6 1.1 9 3.1 12.9l7.5-5.4z'
                    transform='translate(0,-3)'
                  />
                  <path
                    fill='#34A853'
                    d='M24 47c5.4 0 10-1.8 13.3-4.8l-6.8-5.3c-1.9 1.3-4.3 2-6.5 2-6.3 0-11.6-4.2-13.5-10l-7 5.4C6.7 41.6 14.7 47 24 47z'
                  />
                </svg>
                Sign Up with Google
              </button>
            </form>
          )}

          {/* login link */}
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: C.gray600,
              marginTop: 24,
            }}
          >
            Already have an account?{' '}
            <Link
              to='/'
              style={{
                color: C.blue600,
                fontWeight: 500,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
