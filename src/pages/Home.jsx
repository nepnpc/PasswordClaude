import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    title: 'Military-Grade Encryption',
    body: 'Every password is encrypted locally with AES-256 before it ever reaches our servers. Your data is unreadable to everyone — including us.',
  },
  {
    number: '02',
    title: 'Zero-Knowledge Architecture',
    body: "We designed the system so that we are technically incapable of reading your vault. Your master password never leaves your device.",
  },
  {
    number: '03',
    title: 'Offline-First Vault',
    body: 'Your vault is always available, with or without an internet connection. Sync happens silently in the background when connectivity returns.',
  },
]

const stats = [
  { value: 'AES-256', label: 'Encryption Standard' },
  { value: 'Zero', label: 'Knowledge Architecture' },
  { value: '100%', label: 'Open Source' },
  { value: 'Cross', label: 'Platform Support' },
]

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

      {/* Hero */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-6">
          Secure Password Management
        </p>
        <h1 className="text-6xl font-light tracking-tight text-white leading-[1.1] mb-8 max-w-3xl">
          Your passwords.<br />Locked tight.<br />Always.
        </h1>
        <p className="text-[#888888] text-lg font-light leading-relaxed max-w-xl mb-10">
          PasswordClaude is a minimal, zero-knowledge password manager built for people who take privacy seriously. No bloat. No colour. No compromise.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/signup"
            className="border border-white text-white text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-white hover:text-black transition-colors duration-150"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="text-xs tracking-widest uppercase text-[#666666] hover:text-white transition-colors duration-150"
          >
            Learn More →
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#333333]">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-black px-8 py-8 flex flex-col gap-1.5">
              <span className="text-2xl font-light text-white tracking-tight">{value}</span>
              <span className="text-xs tracking-widest uppercase text-[#555555]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">
          Why PasswordClaude
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333333]">
          {features.map(({ number, title, body }) => (
            <div key={number} className="bg-black p-8 flex flex-col gap-4 border border-transparent hover:border-[#333333] active:border-white transition-colors duration-150">
              <span className="text-xs text-[#666666] font-light">{number}</span>
              <h3 className="text-base font-medium text-white tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-sm text-[#888888] font-light leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border border-[#333333] hover:border-[#555555] active:border-white transition-colors duration-150 p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-2">
            Ready?
          </p>
          <h2 className="text-2xl font-light tracking-tight text-white">
            Start securing your passwords today.
          </h2>
        </div>
        <Link
          to="/signup"
          className="shrink-0 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-white hover:text-black transition-colors duration-150"
        >
          Create Free Account
        </Link>
      </section>

    </main>
  )
}
