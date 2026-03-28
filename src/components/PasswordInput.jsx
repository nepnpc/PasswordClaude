import { useState } from 'react'

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default function PasswordInput({ label, placeholder = '••••••••', name, autoComplete, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs tracking-widest uppercase text-[#666666]">
          {label}
        </label>
      )}
      <div className="relative flex items-center border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full bg-black text-white text-sm px-4 py-3 pr-12 outline-none placeholder-[#444444]"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-0 top-0 bottom-0 px-4 text-[#555555] hover:text-white transition-colors duration-150 flex items-center cursor-pointer"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}
