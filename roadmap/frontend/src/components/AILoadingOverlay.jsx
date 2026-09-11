import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Search, Route, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { icon: Search, label: 'Analyzing your skills & interests', duration: 3000 },
  { icon: Brain, label: 'Evaluating career paths', duration: 3500 },
  { icon: Route, label: 'Building personalized roadmap', duration: 4000 },
  { icon: BookOpen, label: 'Curating learning resources', duration: 3000 },
  { icon: Sparkles, label: 'Finalizing your career plan', duration: 2500 },
]

const AILoadingOverlay = ({ isVisible, mode = 'generate' }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      return
    }

    const timers = []
    let accumulated = 0

    STEPS.forEach((step, index) => {
      if (index === 0) return
      accumulated += STEPS[index - 1].duration
      timers.push(setTimeout(() => setCurrentStep(index), accumulated))
    })

    return () => timers.forEach(clearTimeout)
  }, [isVisible])

  if (!isVisible) return null

  const title = mode === 'adapt' 
    ? 'Adapting Your Roadmap' 
    : 'SkillRoute AI is Working'

  const subtitle = mode === 'adapt'
    ? 'Analyzing your progress and optimizing your learning path...'
    : 'Creating your personalized career roadmap...'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Header with animated icon */}
          <div className="p-6 pb-4 text-center">
            <div className="relative inline-flex mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-violet-300 dark:border-violet-700"
                style={{ margin: '-8px' }}
              />
              <div className="relative p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full shadow-lg shadow-violet-500/25">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="px-6 pb-6 space-y-3">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                    isActive
                      ? 'bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-800'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-900/30'
                      : 'bg-gray-50 dark:bg-zinc-800/50 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-all duration-500 ${
                    isActive
                      ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                      : isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-sm font-medium transition-all duration-500 ${
                    isActive
                      ? 'text-violet-900 dark:text-violet-300'
                      : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.label}
                  </span>

                  {isActive && (
                    <motion.div
                      className="ml-auto flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Bottom progress bar */}
          <div className="h-1 bg-gray-100 dark:bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AILoadingOverlay
