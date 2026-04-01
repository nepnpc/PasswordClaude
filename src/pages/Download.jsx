const DOWNLOAD_URL =
  'https://github.com/nepnpc/PasswordClaude/releases/download/v1.0.0/PasswordClaude.Setup.1.0.0.exe'

const ANDROID_DOWNLOAD_URL =
  'https://github.com/nepnpc/PasswordClaude/releases/download/v1.0.0/PasswordClaude-1.0.0.apk'

const steps = [
  { number: '01', title: 'Download the installer', body: 'Click the button below to download PasswordClaude Setup 1.0.0.exe (79 MB).' },
  { number: '02', title: 'Run the installer', body: 'Double-click the downloaded file. Windows may show a SmartScreen prompt — click "More info" then "Run anyway". The app installs in seconds.' },
  { number: '03', title: 'Launch & create your vault', body: 'Open PasswordClaude from the Start menu or desktop shortcut. Sign up and set your master password to get started.' },
]

const androidSteps = [
  { number: '01', title: 'Download the APK', body: 'Tap the button below to download PasswordClaude-1.0.0.apk to your Android device.' },
  { number: '02', title: 'Allow unknown sources', body: 'Go to Settings → Security (or Apps) → Install unknown apps and allow your browser or file manager to install APKs.' },
  { number: '03', title: 'Install & open', body: 'Open the downloaded APK, tap Install, then launch PasswordClaude from your app drawer. Sign in to access your vault.' },
]

const requirements = [
  { label: 'OS', value: 'Windows 10 or later (64-bit)' },
  { label: 'Version', value: '1.0.0' },
  { label: 'Size', value: '79 MB' },
  { label: 'Architecture', value: 'x64' },
]

const androidRequirements = [
  { label: 'OS', value: 'Android 10 or later' },
  { label: 'Version', value: '1.0.0' },
  { label: 'Size', value: '73 MB' },
  { label: 'Architecture', value: 'arm64' },
]

export default function Download() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

      {/* Hero */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-6">
          Windows Desktop App
        </p>
        <h1 className="text-6xl font-light tracking-tight text-white leading-[1.1] mb-8 max-w-3xl">
          Download<br />PasswordClaude.
        </h1>
        <p className="text-[#888888] text-lg font-light leading-relaxed max-w-xl mb-10">
          The full desktop experience. Your vault runs locally — no browser needed. Same zero-knowledge encryption, now as a native Windows app.
        </p>
        <a
          href={DOWNLOAD_URL}
          className="inline-flex items-center gap-3 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-white hover:text-black transition-colors duration-150"
        >
          <DownloadIcon />
          Download for Windows — v1.0.0
        </a>
        <p className="mt-4 text-xs text-[#555555] tracking-wide">
          Free · 79 MB · Windows 10+
        </p>
      </section>

      {/* System requirements */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">
          System Requirements
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#333333]">
          {requirements.map(({ label, value }) => (
            <div key={label} className="bg-black px-8 py-8 flex flex-col gap-1.5">
              <span className="text-base font-light text-white tracking-tight">{value}</span>
              <span className="text-xs tracking-widest uppercase text-[#555555]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Installation steps */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">
          How to Install
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333333]">
          {steps.map(({ number, title, body }) => (
            <div key={number} className="bg-black p-8 flex flex-col gap-4">
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

      {/* SmartScreen note */}
      <section className="border border-[#333333] p-8 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">
          Windows SmartScreen Notice
        </p>
        <p className="text-sm text-[#888888] font-light leading-relaxed max-w-2xl">
          Because this app is not signed with a paid Microsoft certificate, Windows SmartScreen may flag it as "unrecognised". This is normal for independent, open-source software.
          To proceed: click <span className="text-white">"More info"</span> on the SmartScreen dialog, then click <span className="text-white">"Run anyway"</span>. The source code is fully open and auditable on GitHub.
        </p>
      </section>

      {/* Android Hero */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-6">
          Android App
        </p>
        <h1 className="text-6xl font-light tracking-tight text-white leading-[1.1] mb-8 max-w-3xl">
          Download<br />for Android.
        </h1>
        <p className="text-[#888888] text-lg font-light leading-relaxed max-w-xl mb-10">
          Your vault in your pocket. Same zero-knowledge encryption as the web and desktop apps — share passwords seamlessly across all your devices.
        </p>
        <a
          href={ANDROID_DOWNLOAD_URL}
          className="inline-flex items-center gap-3 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-white hover:text-black transition-colors duration-150"
        >
          <DownloadIcon />
          Download for Android — v1.0.0
        </a>
        <p className="mt-4 text-xs text-[#555555] tracking-wide">
          Free · 73 MB · Android 10+
        </p>
      </section>

      {/* Android requirements */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">
          Android Requirements
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#333333]">
          {androidRequirements.map(({ label, value }) => (
            <div key={label} className="bg-black px-8 py-8 flex flex-col gap-1.5">
              <span className="text-base font-light text-white tracking-tight">{value}</span>
              <span className="text-xs tracking-widest uppercase text-[#555555]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Android install steps */}
      <section className="border-b border-[#333333] pb-20 mb-20">
        <p className="text-xs tracking-widest uppercase text-[#666666] mb-12">
          How to Install on Android
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333333]">
          {androidSteps.map(({ number, title, body }) => (
            <div key={number} className="bg-black p-8 flex flex-col gap-4">
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

      {/* CTA */}
      <section className="border border-[#333333] hover:border-[#555555] transition-colors duration-150 p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-2">
            Prefer the browser?
          </p>
          <h2 className="text-2xl font-light tracking-tight text-white">
            Use PasswordClaude online — no install needed.
          </h2>
        </div>
        <a
          href="/signup"
          className="shrink-0 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-white hover:text-black transition-colors duration-150"
        >
          Open Web App
        </a>
      </section>

    </main>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
