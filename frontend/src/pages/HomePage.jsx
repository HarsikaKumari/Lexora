import { Link } from 'react-router-dom';

const features = [
    {
        icon: '⚖',
        title: 'Verified Lawyers',
        desc: 'All professionals are bar-council verified and licensed.',
    },
    {
        icon: '🔒',
        title: 'Secure Consultations',
        desc: 'End-to-end encrypted sessions, fully confidential.',
    },
    {
        icon: '📄',
        title: 'Document Generation',
        desc: 'Generate affidavits, contracts, petitions instantly.',
    },
    {
        icon: '📅',
        title: 'Easy Booking',
        desc: 'Book a consultation in under 2 minutes, anytime.',
    },
];

const steps = [
    {
        step: '01',
        title: 'Search a service',
        desc: 'Filter by legal issue, region, or document type.',
    },
    {
        step: '02',
        title: 'Book a slot',
        desc: 'Pick a date and time that works for you.',
    },
    {
        step: '03',
        title: 'Consult & resolve',
        desc: 'Get expert legal help and your documents ready.',
    },
];

const stats = [
    { value: '10,000+', label: 'Clients served' },
    { value: '500+', label: 'Verified lawyers' },
    { value: '25+', label: 'Legal specialisations' },
    { value: '4.8★', label: 'Average rating' },
];

export default function Home() {
    return (
        <div className='bg-white'>
            {/* ── HERO ── */}
            <section
                className='min-h-screen flex flex-col justify-center px-6 lg:px-20'
                style={{
                    background:
                        'linear-gradient(160deg, #0b1d3a 0%, #0f2d5e 60%, #1a3f7c 100%)',
                }}
            >
                <div className='max-w-4xl mx-auto text-center'>
                    <div
                        className='inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20
            rounded-full px-4 py-2 mb-8'
                    >
                        <div className='w-2 h-2 rounded-full bg-blue-400' />
                        <span className='text-blue-300 text-xs font-medium uppercase tracking-widest'>
                            Legal Consultation Platform
                        </span>
                    </div>

                    <h1
                        className='text-5xl lg:text-7xl font-extrabold text-white leading-tight
            tracking-tight mb-6'
                    >
                        Expert legal help,{' '}
                        <span className='text-blue-400'>when you need it.</span>
                    </h1>
                    <p className='text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10'>
                        Connect with verified lawyers across India, manage your cases, and
                        generate legal documents — all from one trusted platform.
                    </p>

                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                        <Link
                            to='/register'
                            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold
                px-8 py-4 rounded-xl text-sm transition-colors w-full sm:w-auto text-center'
                        >
                            Get started free
                        </Link>
                        <Link
                            to='/services'
                            className='border border-slate-600 hover:border-slate-400 text-slate-300
                hover:text-white font-medium px-8 py-4 rounded-xl text-sm
                transition-colors w-full sm:w-auto text-center'
                        >
                            Browse services
                        </Link>
                    </div>
                </div>

                {/* Stats row */}
                <div className='max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-20'>
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className='text-center border border-white/10 rounded-xl px-4 py-5 bg-white/5'
                        >
                            <p className='text-2xl font-bold text-white'>{s.value}</p>
                            <p className='text-slate-400 text-xs mt-1'>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className='py-24 px-6 lg:px-20 bg-slate-50'>
                <div className='max-w-5xl mx-auto'>
                    <p
                        className='text-blue-600 text-xs font-semibold uppercase tracking-widest
            text-center mb-3'
                    >
                        Why LegalConnect
                    </p>
                    <h2 className='text-3xl font-bold text-slate-900 text-center mb-12 tracking-tight'>
                        Everything you need, in one place
                    </h2>
                    <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className='bg-white border border-slate-200 rounded-2xl p-6
                  hover:border-blue-200 hover:shadow-sm transition-all'
                            >
                                <div
                                    className='w-10 h-10 bg-blue-50 rounded-xl flex items-center
                  justify-center mb-4 text-lg'
                                >
                                    {f.icon}
                                </div>
                                <h3 className='font-semibold text-slate-900 text-sm mb-2'>
                                    {f.title}
                                </h3>
                                <p className='text-slate-500 text-xs leading-relaxed'>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className='py-24 px-6 lg:px-20 bg-white'>
                <div className='max-w-4xl mx-auto'>
                    <p
                        className='text-blue-600 text-xs font-semibold uppercase tracking-widest
            text-center mb-3'
                    >
                        How it works
                    </p>
                    <h2 className='text-3xl font-bold text-slate-900 text-center mb-12 tracking-tight'>
                        Get legal help in 3 steps
                    </h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        {steps.map((s, i) => (
                            <div
                                key={s.step}
                                className='relative text-center'
                            >
                                {i < steps.length - 1 && (
                                    <div
                                        className='hidden md:block absolute top-6 left-[60%] w-full
                    h-px bg-slate-200'
                                    />
                                )}
                                <div
                                    className='w-12 h-12 rounded-full bg-blue-600 text-white font-bold
                  text-sm flex items-center justify-center mx-auto mb-4 relative z-10'
                                >
                                    {s.step}
                                </div>
                                <h3 className='font-semibold text-slate-900 mb-2'>{s.title}</h3>
                                <p className='text-slate-500 text-sm leading-relaxed'>
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section
                className='py-24 px-6 lg:px-20'
                style={{ background: 'linear-gradient(135deg, #0b1d3a, #1a3f7c)' }}
            >
                <div className='max-w-2xl mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-white mb-4 tracking-tight'>
                        Ready to get started?
                    </h2>
                    <p className='text-slate-400 mb-8'>
                        Join thousands of clients and lawyers already using LegalConnect.
                    </p>
                    <Link
                        to='/register'
                        className='bg-blue-500 hover:bg-blue-600 text-white font-semibold
              px-8 py-4 rounded-xl text-sm transition-colors inline-block'
                    >
                        Create your free account
                    </Link>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className='bg-slate-900 px-6 lg:px-20 py-8'>
                <div
                    className='max-w-6xl mx-auto flex flex-col md:flex-row items-center
          justify-between gap-4'
                >
                    <div className='flex items-center gap-2'>
                        <div className='w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center'>
                            <span className='text-white text-xs font-bold'>LC</span>
                        </div>
                        <span className='text-white font-semibold text-sm'>
                            LegalConnect
                        </span>
                    </div>
                    <p className='text-slate-500 text-xs'>
                        © 2025 All rights reserved<br />
                        Contact us: 924837492
                    </p>
                    <div className='flex gap-6'>
                        <Link
                            to='/services'
                            className='text-slate-400 hover:text-white text-xs transition-colors'
                        >
                            Services
                        </Link>
                        <Link
                            to='/login'
                            className='text-slate-400 hover:text-white text-xs transition-colors'
                        >
                            Sign in
                        </Link>
                        <Link
                            to='/register'
                            className='text-slate-400 hover:text-white text-xs transition-colors'
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
