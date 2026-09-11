import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap, TrendingUp, Gauge } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const ProgressTracker = ({ progress, phases }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  if (!progress) return null;

  const { completed_phases, total_phases, streak_days, last_activity_date } = progress;
  const percentage = total_phases > 0 ? Math.round((completed_phases / total_phases) * 100) : 0;

  const getLearningPace = () => {
    if (!last_activity_date) return { label: 'Just Started', color: 'blue', icon: Zap };

    const daysSinceStart = Math.max(1, Math.floor((new Date() - new Date(last_activity_date)) / (1000 * 60 * 60 * 24)));
    const phasesPerWeek = (completed_phases / daysSinceStart) * 7;

    if (phasesPerWeek >= 1.5) return { label: 'Fast', color: 'green', icon: TrendingUp };
    if (phasesPerWeek >= 0.5) return { label: 'On Track', color: 'blue', icon: Gauge };
    return { label: 'Take Your Time', color: 'orange', icon: Zap };
  };

  const pace = getLearningPace();
  const PaceIcon = pace.icon;

  const currentPhase = phases?.find(phase => phase.status !== 'completed');
  const nextPhase = phases?.find((phase, index) => {
    const phaseIndex = phases.indexOf(currentPhase);
    return index === phaseIndex + 1;
  });

  useEffect(() => {
    if (percentage === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [percentage]);

  const getPaceColor = (color) => {
    const colors = {
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mobile-spacing">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-full"
        >
          <Card className="h-full hover-lift bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <CardContent className="p-3 h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-xl shadow-md">
                  <Flame className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    Streak
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                    {streak_days}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-full"
        >
          <Card className="h-full hover-lift bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <CardContent className="p-3 h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-2 w-full">
                <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-md">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    Progress
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-2">
                    {percentage}%
                  </h3>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="h-full"
        >
          <Card className="h-full hover-lift bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <CardContent className="p-3 h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-xl shadow-md">
                  <PaceIcon className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    Pace
                  </p>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {pace.label}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="h-full"
        >
          <Card className="h-full hover-lift bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <CardContent className="p-3 h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-xl shadow-md">
                  <Calendar className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    Last Active
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {last_activity_date ? new Date(last_activity_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

