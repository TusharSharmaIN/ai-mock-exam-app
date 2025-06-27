import { useEffect, useState, useRef } from 'react'
import { generateQuestions } from '../services/aiService'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const fetched = useRef(false)

  const config = JSON.parse(localStorage.getItem('config') || '{}')
  const { mcq = 0, short = 0, long = 0, code = 0 } = config

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    const topic = localStorage.getItem('topic')
    const difficulty = localStorage.getItem('difficulty')
    generateQuestions(topic, difficulty, config)
      .then((q) => {
        setQuestions(q)
        setUserAnswers(q.map((item) => ({ ...item, userAnswer: '' })))
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  },)

  const handleChange = (index, value) => {
    const updated = [...userAnswers]
    updated[index].userAnswer = value
    setUserAnswers(updated)
  }

  const handleSubmit = () => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers))
    navigate('/result')
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-700"></div></div>

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Answer the following questions:</h2>
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Test Configuration: {mcq} MCQ, {short} Short, {long} Long, {code} Code</p>
        {questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Q{i + 1}. {q.question}</p>
            {q.type === 'MCQ' && (
              <div className="flex flex-col gap-1 mt-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex gap-2 text-gray-800 dark:text-gray-200">
                    <input type="radio" name={`q${i}`} value={opt} checked={userAnswers[i]?.userAnswer === opt} onChange={() => handleChange(i, opt)} className="accent-blue-600 dark:accent-blue-400" />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {(q.type === 'ShortAnswer') && (
              <textarea className="border border-gray-300 dark:border-gray-600 rounded p-2 mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" rows={3} placeholder="Write your short answer..." value={userAnswers[i]?.userAnswer} onChange={(e) => handleChange(i, e.target.value)} />
            )}
            {q.type === 'LongAnswer' && (
              <textarea className="border border-gray-300 dark:border-gray-600 rounded p-2 mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" rows={5} placeholder="Write your detailed answer..." value={userAnswers[i]?.userAnswer} onChange={(e) => handleChange(i, e.target.value)} />
            )}
            {q.type === 'Code' && (
              <textarea className="border border-gray-300 dark:border-gray-600 rounded p-2 mt-2 w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono" rows={6} placeholder="Write your code here..." value={userAnswers[i]?.userAnswer} onChange={(e) => handleChange(i, e.target.value)} />
            )}
          </div>
        ))}
        <button onClick={handleSubmit} className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600">Submit</button>
      </div>
    </div>
  )
}