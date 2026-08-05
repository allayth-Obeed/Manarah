/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // MODIFIED: كان الوضع الافتراضي 'media' (يعتمد على تفضيل نظام التشغيل)، بينما themeProvider.jsx
  // يضبط data-theme على <html> يدوياً — فكلاسات dark: لم تكن تُفعَّل أبداً. الآن Tailwind يقرأ نفس السمة.
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
}