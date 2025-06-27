import { useEffect, useState, useRef } from 'react'
import { evaluateAnswers } from '../services/aiService'
import { Link } from 'react-router-dom'  // new import

export default function Result() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  const config = JSON.parse(localStorage.getItem('config') || '{}')
  const { mcq = 0, short = 0, long = 0, code = 0 } = config

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    const stored = JSON.parse(localStorage.getItem('userAnswers') || '[]')
    evaluateAnswers(stored)
      .then((res) => {
        const filtered = res.filter(item => {
          if (item.type === 'MCQ') return mcq > 0
          if (item.type === 'ShortAnswer') return short > 0
          if (item.type === 'LongAnswer') return long > 0
          if (item.type === 'Code') return code > 0
          return false
        })
        setResults(filtered)
      })
      .catch((err) => console.error('Evaluation error:', err))
      .finally(() => setLoading(false))
  },)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-green-600 dark:border-t-green-400 border-gray-200 dark:border-gray-700"></div>
      </div>
    )
  }

  const totalPoints = results.reduce((sum, r) => sum + r.outOf, 0)
  const earned = results.reduce((sum, r) => sum + r.score, 0)

  return (
    <div>
      {/* Home link */}
      <div className="p-4">
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </Link>
      </div>

      {/* Results Card */}
      <div className="p-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Result</h2>
        <p className="mb-2 text-gray-800 dark:text-gray-200">Score: {earned} / {totalPoints}</p>
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="border border-gray-300 dark:border-gray-600 p-3 rounded bg-gray-50 dark:bg-gray-700">
              <p className="text-gray-900 dark:text-gray-100"><strong>Q{i + 1}:</strong> {r.question}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Type:</strong> {r.type}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Your Answer:</strong> {r.userAnswer}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Score:</strong> {r.score} / {r.outOf}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Feedback:</strong> {r.feedback}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Suggestion:</strong> {r.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}