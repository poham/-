/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg': '1024px',  // 平板斷點
        'xl': '1500px',  // 桌面模式斷點（左右側欄自動展開）
        '2xl': '1536px', // 超大螢幕
      },
      colors: {
        // 步驟專屬顏色主題
        'step-presets': {
          light: '#60a5fa',  // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',   // blue-600
        },
        'step-subject': {
          light: '#34d399',  // emerald-400
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',   // emerald-600
        },
        'step-scene': {
          light: '#818cf8',  // indigo-400
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',   // indigo-600
        },
        'step-camera': {
          light: '#38bdf8',  // sky-400
          DEFAULT: '#0ea5e9', // sky-500
          dark: '#0284c7',   // sky-600
        },
        'step-light': {
          light: '#fbbf24',  // amber-400
          DEFAULT: '#f59e0b', // amber-500
          dark: '#d97706',   // amber-600
        },
        'step-style': {
          light: '#c084fc',  // purple-400
          DEFAULT: '#a855f7', // purple-500
          dark: '#9333ea',   // purple-600
        },
        'step-export': {
          light: '#4ade80',  // green-400
          DEFAULT: '#22c55e', // green-500
          dark: '#16a34a',   // green-600
        },
        'step-settings': {
          light: '#94a3b8',  // slate-400
          DEFAULT: '#64748b', // slate-500
          dark: '#475569',   // slate-600
        },
      },
      fontSize: {
        // 自定義字體大小（更清晰）
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.625' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.5' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.25' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }],    // 36px
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
    },
  },
  plugins: [],
}
