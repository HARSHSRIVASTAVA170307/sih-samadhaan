import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import DecisionInsightsModal from './DecisionInsightsModal';

const CareerMatchCard = ({ careerDecision, onViewInsights }) => {
    const [showModal, setShowModal] = useState(false);

    if (!careerDecision) {
        return null;
    }

    const {
        career,
        confidence = 0,
        skill_match_percentage = 0,
        market_readiness = 0,
        industry_demand = 'stable',
    } = careerDecision;

    const getDemandBadge = (demand) => {
        const level = typeof demand === 'string' ? demand : (demand?.demand_level || 'stable');
        switch (level) {
            case 'trending':
                return { bg: 'bg-emerald-500', label: 'High Demand' };
            case 'stable':
                return { bg: 'bg-blue-500', label: 'Stable' };
            default:
                return { bg: 'bg-violet-500', label: 'Emerging' };
        }
    };

    const demandBadge = getDemandBadge(industry_demand);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full mt-6 mb-4"
            >
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">

                    <div className="p-5 sm:p-6 md:p-8 pb-5 sm:pb-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                            <div className="flex-1 min-w-0">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3"
                                >
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 ${demandBadge.bg} bg-opacity-10 text-${demandBadge.bg.replace('bg-', '')} rounded-md`}>
                                        <TrendingUp className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${demandBadge.bg.replace('bg-', 'text-')}`} />
                                        <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${demandBadge.bg.replace('bg-', 'text-')}`}>
                                            {demandBadge.label}
                                        </span>
                                    </span>
                                    {typeof industry_demand === 'object' && industry_demand.live_job_count !== undefined && industry_demand.live_job_count > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider">
                                                {industry_demand.live_job_count}+ LIVE JOBS
                                            </span>
                                        </span>
                                    )}
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight break-words"
                                >
                                    {career}
                                </motion.h2>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                    Based on your skills and interests, this path is <span className="text-gray-900 dark:text-white font-medium">highly recommended</span> for you.
                                </p>
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                                className="group w-full md:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
                            >
                                <span>View Insights</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="px-5 sm:px-6 md:px-8 pb-6 sm:pb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gray-50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-center justify-between sm:flex-col sm:justify-center text-left sm:text-center"
                            >
                                <div className="flex items-center gap-2 mb-0 sm:mb-3">
                                    <Sparkles className="w-4 h-4 text-violet-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        AI Match
                                    </span>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <span className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {confidence}%
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-gray-50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 sm:p-5"
                            >
                                <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-3">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Skill Alignment
                                        </span>
                                    </div>
                                    <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:hidden">
                                        {skill_match_percentage}%
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-end gap-1.5 mb-2">
                                    <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {skill_match_percentage}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill_match_percentage}%` }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gray-50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 sm:p-5"
                            >
                                <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Market Readiness
                                        </span>
                                    </div>
                                    <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:hidden">
                                        {market_readiness}%
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-end gap-1.5 mb-2">
                                    <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {market_readiness}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${market_readiness}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-amber-500 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DecisionInsightsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                careerDecision={careerDecision}
            />
        </>
    );
};

export default CareerMatchCard;
