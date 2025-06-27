import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
      <Link to="/" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
        <span className="text-xl">✍️</span>
        <span className="font-semibold">Home</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}