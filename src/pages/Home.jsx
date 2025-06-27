import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')

  const [mcq, setMcq] = useState(5)
  const [short, setShort] = useState(0)
  const [long, setLong] = useState(0)
  const [code, setCode] = useState(0)
  const [showOptions, setShowOptions] = useState(false)

  const handleStart = () => {
    if (!topic.trim()) return alert('Please enter a topic')
    localStorage.setItem('topic', topic)
    localStorage.setItem('difficulty', difficulty)
    localStorage.setItem('config', JSON.stringify({ mcq, short, long, code }))
    navigate('/quiz')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Mock Exam Generator</h1>
      <input
        type="text"
        placeholder="Enter Topic (e.g., Python Programming)"
        className="border border-gray-300 dark:border-gray-600 p-2 w-full max-w-md rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
          {/** Number inputs **/}
          <label className="flex flex-col">
            <span className="text-gray-800 dark:text-gray-200">MCQ Questions</span>
            <input
              type="number" min={0}
              className="border border-gray-300 dark:border-gray-600 p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={mcq}
              onChange={e => setMcq(+e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-800 dark:text-gray-200">Short Answer Questions</span>
            <input
              type="number" min={0}
              className="border border-gray-300 dark:border-gray-600 p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={short}
              onChange={e => setShort(+e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-800 dark:text-gray-200">Long Answer Questions</span>
            <input
              type="number" min={0}
              className="border border-gray-300 dark:border-gray-600 p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={long}
              onChange={e => setLong(+e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-800 dark:text-gray-200">Coding Questions</span>
            <input
              type="number" min={0}
              className="border border-gray-300 dark:border-gray-600 p-1 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={code}
              onChange={e => setCode(+e.target.value)}
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
  )
}