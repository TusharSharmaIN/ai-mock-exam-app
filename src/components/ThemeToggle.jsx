import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement;
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored === 'dark' || (!stored && prefersDark)
    setIsDark(dark)
    root.classList.toggle('dark', dark)
  }, [])

  const toggle = () => {
    const root = window.document.documentElement;
    const next = !isDark
    root.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setIsDark(next)
  }

  return (
    <button onClick={toggle} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}