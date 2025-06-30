import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { DEFAULT_CONFIG } from '../constants/defaultConfig'

export default function Home() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')

  // Initialize state from constants
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG })
  const { mcq, short, long, code } = config
  const [showOptions, setShowOptions] = useState(false)

  const handleStart = () => {
    if (!topic.trim()) return alert('Please enter a topic')
    localStorage.setItem('topic', topic)
    localStorage.setItem('difficulty', difficulty)
    localStorage.setItem('config', JSON.stringify(config))
    navigate('/quiz')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quick Assessment Tool</h1>
        <input
          type="text"
          placeholder="Enter Topic (e.g., Modern History or Algebra)"
          className="border border-gray-300 dark:border-gray-600 p-2 w-full max-w-md rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-2 w-full max-w-md rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          className="text-blue-600 dark:text-blue-400 underline text-sm"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? 'Hide Test Configuration' : 'Customize Test'}
        </button>

        {showOptions && (
          <div className="grid gap-2 w-full max-w-md text-sm">
            <label>
              MCQ Questions
              <input
                type="number"
                min={0}
                className="border p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={mcq}
                onChange={e => setConfig({ ...config, mcq: +e.target.value })}
              />
            </label>
            <label>
              Short Answer Questions
              <input
                type="number"
                min={0}
                className="border p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={short}
                onChange={e => setConfig({ ...config, short: +e.target.value })}
              />
            </label>
            <label>
              Long Answer Questions
              <input
                type="number"
                min={0}
                className="border p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={long}
                onChange={e => setConfig({ ...config, long: +e.target.value })}
              />
            </label>
            <label>
              Coding Questions
              <input
                type="number"
                min={0}
                className="border p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={code}
                onChange={e => setConfig({ ...config, code: +e.target.value })}
              />
            </label>
          </div>
        )}

        <button
          onClick={handleStart}
          className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Start Test
        </button>
      </div>
    </div>
  )
}