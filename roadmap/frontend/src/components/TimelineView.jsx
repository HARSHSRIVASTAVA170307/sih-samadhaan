import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';
import MilestoneCard from './MilestoneCard';

const TimelineView = ({ roadmap, progress, onMilestoneComplete, onToggleView }) => {
    const [expandedPhases, setExpandedPhases] = useState([0]);

    if (!roadmap || !roadmap.roadmap) {
        return null;
    }

    const phases = roadmap.roadmap;
    const completedCount = progress?.completed_phases || 0;

    const togglePhase = (index) => {
        setExpandedPhases((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const getPhaseStatus = (index) => {
        if (index < completedCount) return 'completed';
        if (index === completedCount) return 'current';
        return 'upcoming';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">

                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Learning Timeline
                            </h3>
                            {onToggleView && (
                                <button
                                    onClick={onToggleView}
                                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Switch View
                                </button>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {completedCount}/{phases.length}
                        </span>
                    </div>
                </div>

                {/* Phases - Clean stacked cards without timeline */}
                <div className="p-4 sm:p-5 space-y-3">
                    {phases.map((phase, index) => {
                        const status = getPhaseStatus(index);
                        const isExpanded = expandedPhases.includes(index);
                        const isCompleted = status === 'completed';
                        const isCurrent = status === 'current';

                        return (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Phase Card */}
                                <div className={`rounded-xl border overflow-hidden ${isCompleted
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                                    : isCurrent
                                        ? 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600'
                                        : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700'
                                    }`}>

                                    {/* Header */}
                                    <button
                                        onClick={() => togglePhase(index)}
                                        className="w-full p-4 text-left"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                {/* Title + Badges */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className={`font-semibold ${isCompleted
                                                        ? 'text-emerald-800 dark:text-emerald-300'
                                                        : 'text-gray-900 dark:text-white'
                                                        }`}>
                                                        {phase.phase || phase.phase_name}
                                                    </h4>
                                                    {isCompleted && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-medium">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Done
                                                        </span>
                                                    )}
                                                    {isCurrent && (
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-medium">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Duration & Skills preview */}
                                                <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{phase.duration}</span>
                                                    {phase.focus_skills && phase.focus_skills.length > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{phase.focus_skills.slice(0, 3).join(', ')}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="px-4 pb-4 space-y-4"
                                        >
                                            {/* Skills */}
                                            {phase.focus_skills && phase.focus_skills.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                                                        Skills
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {phase.focus_skills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Outcomes */}
                                            {phase.outcomes && phase.outcomes.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                                                        Outcomes
                                                    </p>
                                                    <ul className="space-y-1.5">
                                                        {phase.outcomes.map((outcome, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 flex-shrink-0"></span>
                                                                {outcome}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Milestones */}
                                            {phase.milestones && phase.milestones.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                                                        Milestones
                                                    </p>
                                                    <div className="space-y-2">
                                                        {phase.milestones.map((milestone, mIdx) => (
                                                            <MilestoneCard
                                                                key={mIdx}
                                                                milestone={milestone}
                                                                phaseIndex={index}
                                                                milestoneIndex={mIdx}
                                                                onComplete={onMilestoneComplete}
                                                                isCompleted={isCompleted}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default TimelineView;
