import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import RoadmapView from '../components/RoadmapView'
import CareerMatchCard from '../components/CareerMatchCard'
import AdaptiveRecommendations from '../components/AdaptiveRecommendations';
import TimelineView from '../components/TimelineView'
import ProgressTracker from '../components/ProgressTracker'
import { FloatingHeader } from '../components/ui/floating-header'
import ConfirmModal from '../components/ConfirmModal'
import { RefreshCw, RotateCcw, Brain } from 'lucide-react'
import AILoadingOverlay from '../components/AILoadingOverlay'
import SkillQuiz from '../components/SkillQuiz'
import LearningOutcomes from '../components/LearningOutcomes'
import JobListings from '../components/JobListings'
import { useDashboardData } from '../hooks/useDashboardData.jsx'
import { Skeleton } from '../components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
  const {
    profile,
    roadmap,
    loading,
    isGenerating,
    generationMode,
    generateRoadmap,
    adaptRoadmap,
    resetCareerPath,
    refreshData
  } = useDashboardData()

  const [showTimeline, setShowTimeline] = useState(true)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [showConfirmAdapt, setShowConfirmAdapt] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const navigate = useNavigate()

  // Listen for the custom event from the hook to trigger adapt modal
  useEffect(() => {
    const handleTriggerAdapt = () => setShowConfirmAdapt(true)
    window.addEventListener('triggerAdapt', handleTriggerAdapt)
    return () => window.removeEventListener('triggerAdapt', handleTriggerAdapt)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleAdaptConfirm = async () => {
    setShowConfirmAdapt(false)
    await adaptRoadmap()
  }

  const handleResetConfirm = async () => {
    setShowConfirmReset(false)
    await resetCareerPath()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <AILoadingOverlay isVisible={isGenerating} mode={generationMode} />
      <FloatingHeader onLogout={handleLogout} userName={profile?.name} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && !roadmap ? (
          <div className="space-y-8 mt-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ) : (
          <>
            {roadmap?.career_decision && (
              <CareerMatchCard careerDecision={roadmap.career_decision} />
            )}

            {roadmap?.progress && roadmap?.learning_roadmap && (
              <div className="mt-8">
                <AdaptiveRecommendations
                  progress={roadmap.progress}
                  roadmap={roadmap.learning_roadmap}
                />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    Take Skill Assessment
                  </button>
                </div>
              </div>
            )}

            {!roadmap && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Start Your Career Journey
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Generate a personalized roadmap to reach your goals.
                  </p>
                </div>
                <RoadmapView
                  roadmap={null}
                  onGenerate={generateRoadmap}
                  loading={loading}
                  onRefresh={refreshData}
                />
              </motion.div>
            )}

            {roadmap && (
              <div className="space-y-8 mt-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-zinc-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Your Roadmap
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Track your progress and achieve your career goals
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-1 shadow-sm relative">
                      <motion.div
                        className="absolute top-1 bottom-1 bg-gray-100 dark:bg-zinc-800 rounded-md z-0"
                        layoutId="toggleHighlight"
                        style={{
                          left: showTimeline ? 'calc(50% + 2px)' : '4px',
                          right: showTimeline ? '4px' : 'calc(50% + 2px)',
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <button
                        onClick={() => setShowTimeline(false)}
                        className={`relative z-10 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${!showTimeline
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Classic
                      </button>
                      <button
                        onClick={() => setShowTimeline(true)}
                        className={`relative z-10 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${showTimeline
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Timeline
                      </button>
                    </div>

                    <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 mx-1 hidden md:block"></div>

                    <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                      <button
                        onClick={() => setShowConfirmAdapt(true)}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-xs sm:text-sm font-medium shadow-sm"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Adapt
                      </button>

                      <button
                        onClick={() => setShowConfirmReset(true)}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50 text-xs sm:text-sm font-medium shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {roadmap.progress && (
                  <ProgressTracker
                    progress={roadmap.progress}
                    phases={roadmap.learning_roadmap?.roadmap}
                  />
                )}

                {roadmap.career_decision && roadmap.progress && (
                  <LearningOutcomes
                    careerDecision={roadmap.career_decision}
                    progress={roadmap.progress}
                    roadmap={roadmap.learning_roadmap}
                  />
                )}

                {roadmap.career_decision?.career && (
                  <JobListings career={roadmap.career_decision.career} />
                )}

                <div>
                  <AnimatePresence mode='wait'>
                    {showTimeline && roadmap?.learning_roadmap ? (
                      <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TimelineView
                          roadmap={roadmap.learning_roadmap}
                          progress={roadmap.progress}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="classic"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <RoadmapView
                          roadmap={roadmap}
                          onGenerate={generateRoadmap}
                          onRefresh={refreshData}
                          loading={loading}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={showConfirmReset}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowConfirmReset(false)}
        title="Reset Career Path?"
        message="This will delete your current roadmap, reset your progress to 0%, and clear your streak. Your profile will be saved and you can generate a new roadmap immediately."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmModal
        isOpen={showConfirmAdapt}
        onConfirm={handleAdaptConfirm}
        onCancel={() => setShowConfirmAdapt(false)}
        title="Adapt Roadmap?"
        message="This will analyze your current progress and performance to generate a more personalized learning path for you. Do you want to proceed?"
        confirmText="Yes, Adapt Path"
        cancelText="Cancel"
      />

      <SkillQuiz
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        skills={profile?.skills || []}
      />
    </div>
  )
}

export default Dashboard

