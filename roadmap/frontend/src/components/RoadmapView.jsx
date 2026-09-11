import { useState } from 'react'
import axios from 'axios'
import { auth } from '../firebase'
import { CheckCircle2, RefreshCw, Sparkles, Clock, Square, CheckSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../contexts/ToastContext'

const RoadmapView = ({ roadmap, onGenerate, onRefresh, loading }) => {
  const [updating, setUpdating] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const toast = useToast()

  const handlePhaseToggle = async (index, currentStatus) => {
    setUpdating(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

      await axios.post(`${API_URL}/api/progress/update`, {
        phase_index: index,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onRefresh()
    } catch (error) {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
    }
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 p-8 sm:p-10 text-center hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div className="inline-flex p-3 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Start Your Journey
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            Generate a personalized career roadmap based on your skills and goals.
          </p>
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 font-medium text-sm shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Roadmap
              </>
            )}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {roadmap.learning_roadmap && roadmap.learning_roadmap.roadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
        >
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Learning Path
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full border border-gray-100 dark:border-zinc-700/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{roadmap.learning_roadmap.duration_months}mo</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence mode="popLayout">
                {roadmap.learning_roadmap.roadmap.map((phase, index) => {
                  const isCompleted = phase.status === 'completed';
                  const isLast = index === roadmap.learning_roadmap.roadmap.length - 1;

                  return (
                    <motion.div
                      key={`${index}-${phase.status}`}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                      className="relative flex gap-3 sm:gap-4 pl-8 sm:pl-10 group"
                    >
                      {!isLast && (
                        <div className="absolute w-px bg-gray-200 dark:bg-zinc-800 left-3 top-3 -bottom-6 sm:left-4 sm:top-4 sm:-bottom-8 group-hover:bg-gray-300 dark:group-hover:bg-zinc-700 transition-colors" />
                      )}

                      <button
                        onClick={() => handlePhaseToggle(index, phase.status)}
                        disabled={updating}
                        className={`absolute left-0 flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ring-4 ring-white dark:ring-zinc-900 ${isCompleted
                          ? 'bg-emerald-500 text-white scale-100'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                          }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : index + 1}
                      </button>

                      <div className={`flex-1 min-w-0 p-3 sm:p-5 rounded-xl border transition-all duration-300 ${isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-900/30'
                        : 'bg-white dark:bg-zinc-800/30 border-gray-100 dark:border-zinc-700/50 hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm'
                        }`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className={`text-sm sm:text-base font-semibold truncate ${isCompleted ? 'text-emerald-900 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                {phase.phase}
                              </h4>
                              {isCompleted && (
                                <motion.span
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex-shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider"
                                >
                                  Done
                                </motion.span>
                              )}
                            </div>
                            {phase.duration && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{phase.duration}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handlePhaseToggle(index, phase.status)}
                            disabled={updating}
                            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group/btn mt-2 sm:mt-0"
                          >
                            <span className={`text-[10px] uppercase font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 group-hover/btn:text-gray-600 dark:group-hover/btn:text-gray-300'} transition-colors`}>
                              {isCompleted ? 'Completed' : 'Mark Done'}
                            </span>
                            {isCompleted ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover/btn:text-gray-500 dark:group-hover/btn:text-gray-400" />
                            )}
                          </button>
                        </div>

                        {phase.focus_skills && phase.focus_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                            {phase.focus_skills.slice(0, 6).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-md text-xs bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {phase.focus_skills.length > 6 && (
                              <span className="text-xs text-gray-400 self-center px-1">
                                +{phase.focus_skills.length - 6}
                              </span>
                            )}
                          </div>
                        )}

                        {phase.outcomes && phase.outcomes.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-zinc-800/50">
                            <ul className="space-y-1.5">
                              {phase.outcomes.slice(0, 3).map((outcome, idx) => (
                                <li key={idx} className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                                  <span className="mr-2 text-gray-300 dark:text-zinc-600 mt-0.5">•</span>
                                  <span className="leading-relaxed line-clamp-2">{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RoadmapView
