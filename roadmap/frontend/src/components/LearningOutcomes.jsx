import { motion } from 'framer-motion'
import { TrendingUp, Clock, Target, Zap, ArrowRight, GraduationCap } from 'lucide-react'

const LearningOutcomes = ({ careerDecision, progress, roadmap }) => {
  if (!careerDecision || !progress) return null

  const { completed_phases = 0, total_phases = 0, streak_days = 0 } = progress
  const completionRate = total_phases > 0 ? Math.round((completed_phases / total_phases) * 100) : 0

  const skillsWhenJoined = careerDecision.skill_gaps || []
  const keyStrengths = careerDecision.key_strengths || []
  const timeToJobReady = careerDecision.time_to_job_ready || 'N/A'

  // Calculate skills gained from completed phases
  const skillsGained = []
  if (roadmap?.roadmap) {
    roadmap.roadmap.forEach((phase, idx) => {
      if (phase.status === 'completed' && phase.focus_skills) {
        skillsGained.push(...phase.focus_skills)
      }
    })
  }
  const uniqueSkillsGained = [...new Set(skillsGained)]

  // Calculate estimated remaining time
  const phasesRemaining = total_phases - completed_phases
  const avgWeeksPerPhase = 3
  const weeksRemaining = phasesRemaining * avgWeeksPerPhase
  const monthsRemaining = Math.ceil(weeksRemaining / 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-violet-100 dark:bg-violet-500/10 rounded-lg">
            <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Learning Outcomes
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Before vs After */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Before Card */}
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Skill Gaps (When Joined)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsWhenJoined.length > 0 ? skillsWhenJoined.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md text-xs bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium">
                  {skill}
                </span>
              )) : (
                <span className="text-xs text-orange-500">No gaps identified</span>
              )}
            </div>
          </div>

          {/* After Card */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Skills Gained</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {uniqueSkillsGained.length > 0 ? uniqueSkillsGained.slice(0, 8).map((skill, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md text-xs bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  {skill}
                </span>
              )) : (
                <span className="text-xs text-emerald-500">Complete phases to gain skills</span>
              )}
              {uniqueSkillsGained.length > 8 && (
                <span className="text-xs text-emerald-400 self-center">+{uniqueSkillsGained.length - 8}</span>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Time to Goal */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 text-center">
            <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {completionRate === 100 ? '✅' : `${monthsRemaining}mo`}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              {completionRate === 100 ? 'Complete' : 'To Goal'}
            </p>
          </div>

          {/* Streak */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 text-center">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {streak_days}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Day Streak
            </p>
          </div>

          {/* Career Target */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 text-center">
            <ArrowRight className="w-4 h-4 text-violet-500 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {timeToJobReady}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Job Ready
            </p>
          </div>
        </div>

        {/* Key Strengths */}
        {keyStrengths.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-900/30">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              Your Key Strengths
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keyStrengths.map((strength, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md text-xs bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LearningOutcomes
