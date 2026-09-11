import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { auth } from '../firebase'
import { useToast } from '../contexts/ToastContext'
import {
  Brain, ChevronRight, CheckCircle2, XCircle, Award,
  Loader2, Sparkles, Target, TrendingUp, X
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SkillQuiz = ({ isOpen, onClose, skills: rawSkills = [] }) => {
  // Normalize skills — could be a string or array
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === 'string'
    ? rawSkills.split(',').map(s => s.trim()).filter(Boolean)
    : []
  const [stage, setStage] = useState('intro') // intro | loading | quiz | result
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const startQuiz = async () => {
    setStage('loading')
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.post(`${API_URL}/api/quiz/generate`, {
        skills: skills
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQuestions(response.data.quiz.questions)
      setCurrentQuestion(0)
      setAnswers({})
      setStage('quiz')
    } catch (err) {
      toast.error('Failed to generate quiz. Please try again.')
      setStage('intro')
    }
  }

  const selectAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [String(questionId)]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    setIsSubmitting(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.post(`${API_URL}/api/quiz/evaluate`, {
        questions: questions,
        answers: answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResult(response.data.evaluation)
      setStage('result')
    } catch (err) {
      toast.error('Failed to evaluate quiz. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStage('intro')
    setQuestions([])
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
    onClose()
  }

  if (!isOpen) return null

  const q = questions[currentQuestion]
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors z-10"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* INTRO STAGE */}
          {stage === 'intro' && (
            <div className="p-8 text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-5 shadow-lg shadow-indigo-500/25">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Skill Assessment
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Take a quick 5-question quiz to assess your skill level. The AI will generate questions based on your stated skills.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {skills.slice(0, 6).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="px-3 py-1 text-xs text-gray-400">+{skills.length - 6} more</span>
                )}
              </div>
              <button
                onClick={startQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Start Assessment
              </button>
            </div>
          )}

          {/* LOADING STAGE */}
          {stage === 'loading' && (
            <div className="p-8 text-center">
              <div className="relative inline-flex mb-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Generating Questions...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI is crafting questions based on your skills
              </p>
            </div>
          )}

          {/* QUIZ STAGE */}
          {stage === 'quiz' && q && (
            <div className="p-6">
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  q.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                  q.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {q.difficulty}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Skill tag */}
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 mb-3">
                <Target className="w-3 h-3" />
                {q.skill_tested}
              </span>

              {/* Question */}
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 leading-relaxed">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = answers[String(q.id)] === key

                  return (
                    <button
                      key={key}
                      onClick={() => selectAnswer(q.id, key)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                          : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {key}
                        </span>
                        <span className={`text-sm font-medium pt-0.5 ${
                          isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {value}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    disabled={!answers[String(q.id)]}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={!allAnswered || isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-indigo-700 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        Submit Quiz
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && result && (
            <div className="p-8">
              {/* Score circle */}
              <div className="text-center mb-6">
                <div className={`inline-flex p-5 rounded-full mb-4 ${
                  result.percentage >= 80 ? 'bg-emerald-100 dark:bg-emerald-500/10' :
                  result.percentage >= 50 ? 'bg-blue-100 dark:bg-blue-500/10' :
                  'bg-orange-100 dark:bg-orange-500/10'
                }`}>
                  <Award className={`w-10 h-10 ${
                    result.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    result.percentage >= 50 ? 'text-blue-600 dark:text-blue-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {result.score}/{result.total}
                </h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                  result.skill_level === 'advanced' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  result.skill_level === 'intermediate' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  {result.skill_level.charAt(0).toUpperCase() + result.skill_level.slice(1)} Level
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                {result.summary}
              </p>

              {/* Question results */}
              <div className="space-y-2 mb-6">
                {result.results?.map((r, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${
                    r.correct
                      ? 'bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-900/30'
                      : 'bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-900/30'
                  }`}>
                    {r.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {questions[idx]?.question?.substring(0, 60)}...
                      </p>
                      {!r.correct && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Correct: {r.correct_answer} — {r.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {result.strengths?.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-900/30">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">Strengths</p>
                    {result.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-emerald-800 dark:text-emerald-300">{s}</p>
                    ))}
                  </div>
                )}
                {result.areas_to_improve?.length > 0 && (
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-900/30">
                    <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1.5">To Improve</p>
                    {result.areas_to_improve.map((s, i) => (
                      <p key={i} className="text-xs text-orange-800 dark:text-orange-300">{s}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SkillQuiz
