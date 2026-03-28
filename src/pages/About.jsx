import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Privacy by Default',
    body: 'Privacy is not a feature — it is the foundation. Everything we build starts from the assumption that data should belong only to its owner.',
  },
  {
    title: 'Radical Transparency',
    body: 'Our code is open source. Our architecture is documented. If you cannot audit it yourself, you can trust that someone already has.',
  },
  {
    title: 'No Unnecessary Data',
    body: 'We collect nothing we do not need. No analytics, no usage tracking, no third-party scripts. Your behaviour is your own.',
  },
  {
    title: 'Minimal Complexity',
    body: 'Security tools should not be complicated. Simple software has fewer bugs, fewer attack surfaces, and is easier to trust.',
  },
]

const steps = [
  { step: '01', title: 'Create your vault', body: 'Sign up with just an email and a master password. Nothing else is required.' },
  { step: '02', title: 'Add your passwords', body: 'Type them in, import a CSV, or let the browser extension capture them automatically.' },
  { step: '03', title: 'Access anywhere', body: 'Your encrypted vault syncs across all your devices. Unlock it only with your master password.' },
]

export default function About() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

      {/* Hero */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-6">About</p>
        <h1 className="text-6xl font-light tracking-tight text-white leading-[1.1] mb-8 max-w-2xl">
          Built on the belief that privacy is a right.
        </h1>
        <p className="text-[#888888] text-lg font-light leading-relaxed max-w-xl">
          PasswordClaude was created because every other password manager asked you to trust them. We built one that does not require it. Our zero-knowledge architecture means we are mathematically incapable of reading your data.
        </p>
      </section>

      {/* Values */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">Our Values</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#333333]">
          {values.map(({ title, body }) => (
            <div key={title} className="bg-black p-8 flex flex-col gap-3">
              <h3 className="text-sm font-medium text-white tracking-tight">{title}</h3>
              <p className="text-sm text-[#666666] font-light leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">How It Works</p>
        <div className="flex flex-col gap-px bg-[#333333]">
          {steps.map(({ step, title, body }) => (
            <div key={step} className="bg-black px-8 py-7 flex items-start gap-10">
              <span className="text-xs text-[#333333] font-light shrink-0 mt-0.5 w-6">{step}</span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-medium text-white tracking-tight">{title}</h3>
                <p className="text-sm text-[#666666] font-light leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-6">Contact</p>
        <h2 className="text-4xl font-light tracking-tight text-white mb-12">Get in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: info */}
          <div className="flex flex-col gap-6">
            <p className="text-sm text-[#666666] font-light leading-relaxed">
              Have a question, a security disclosure, or just want to say hello? Fill out the form and we will get back to you within one business day.
            </p>
            <div className="flex flex-col gap-4 pt-2">
              <div className="border-b border-[#1f1f1f] pb-4">
                <p className="text-xs tracking-widest uppercase text-[#444444] mb-1">General</p>
                <p className="text-sm text-white font-light">hello@passwordclaude.com</p>
              </div>
              <div className="border-b border-[#1f1f1f] pb-4">
                <p className="text-xs tracking-widest uppercase text-[#444444] mb-1">Security</p>
                <p className="text-sm text-white font-light">security@passwordclaude.com</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-[#444444] mb-1">Response Time</p>
                <p className="text-sm text-white font-light">Within 1 business day</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#666666]">Name</label>
              <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#666666]">Email</label>
              <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#666666]">Message</label>
              <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

    </main>
  )
}
