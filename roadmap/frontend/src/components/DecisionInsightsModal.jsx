import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Target, TrendingUp, CheckCircle2, XCircle, Briefcase, MapPin, Tag } from 'lucide-react';
import AgentDecisionTrace from './AgentDecisionTrace';

const DecisionInsightsModal = ({ isOpen, onClose, careerDecision }) => {
    if (!isOpen || !careerDecision) return null;

    const {
        career,
        reasoning,
        confidence,
        skill_match_percentage = 0,
        key_strengths = [],
        skill_gaps = [],
        time_to_job_ready,
        alternatives = [],
        industry_demand,
        decision_trace = [],
    } = careerDecision;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-card rounded-2xl shadow-2xl"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <style>{`
                            .glass-card::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-700 p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        Career Decision Insights
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Understanding why <span className="font-semibold text-gray-900 dark:text-white">{career}</span> is recommended for you
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Agent Decision Trace */}
                            {decision_trace.length > 0 && (
                                <AgentDecisionTrace decisionTrace={decision_trace} />
                            )}

                            {/* AI Reasoning */}
                            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-100 dark:border-zinc-700">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                                        <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Analysis</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Confidence: {confidence}%</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {reasoning}
                                </p>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Your Strengths */}
                                {key_strengths.length > 0 && (
                                    <div className="p-5 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-zinc-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Your Strengths</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {key_strengths.map((strength, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                    <span className="text-green-600 dark:text-green-400 mt-1">●</span>
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Skill Gaps */}
                                {skill_gaps.length > 0 && (
                                    <div className="p-5 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-zinc-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Areas to Develop</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {skill_gaps.map((gap, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                    <span className="text-orange-600 dark:text-orange-400 mt-1">●</span>
                                                    <span>{gap}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Skill Match</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{skill_match_percentage}%</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Industry Demand</p>
                                    <p className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
                                        {typeof industry_demand === 'object' ? industry_demand.demand_level : (industry_demand || 'Stable')}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 text-center col-span-2 md:col-span-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time to Job Ready</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{time_to_job_ready || 'TBD'}</p>
                                </div>
                            </div>

                            {/* Real-Time Market Data */}
                            {typeof industry_demand === 'object' && (
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-zinc-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">Real-Time Market Analysis</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <Briefcase className="w-4 h-4 text-blue-500" />
                                                <span className="font-medium">Live Openings:</span> 
                                                <span className="font-bold text-gray-900 dark:text-white">{industry_demand.live_job_count !== null ? `${industry_demand.live_job_count}+ currently active` : 'Data unavailable'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <Target className="w-4 h-4 text-emerald-500" />
                                                <span className="font-medium">Avg Salary range:</span> 
                                                <span className="font-bold text-gray-900 dark:text-white">{industry_demand.avg_salary_range}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <TrendingUp className="w-4 h-4 text-violet-500" />
                                                <span className="font-medium">Growth Projection:</span> 
                                                <span className="font-bold text-gray-900 dark:text-white capitalize">{industry_demand.growth_projection?.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                        
                                        {industry_demand.top_skills_in_demand && industry_demand.top_skills_in_demand.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                                    <Tag className="w-4 h-4 text-amber-500" />
                                                    Trending Skills from Live Jobs
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {industry_demand.top_skills_in_demand.map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {industry_demand.data_source && (
                                        <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-zinc-700/50 text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Data Source: {industry_demand.data_source}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Alternative Careers */}
                            {alternatives.length > 0 && (
                                <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Alternative Career Paths</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {alternatives.map((alt, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                            {alt.career}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {alt.reason}
                                                        </p>
                                                        {/* Why not chosen */}
                                                        {alt.rejection_reason && (
                                                            <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
                                                                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                                <span>{alt.rejection_reason}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Match</p>
                                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            {alt.match_score}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Next Steps CTA */}
                            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                                <h3 className="font-bold text-lg mb-2">Ready to Start Your Journey?</h3>
                                <p className="text-indigo-100 mb-4">
                                    Your personalized learning roadmap is designed to help you achieve your career goals efficiently.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                    View My Roadmap
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DecisionInsightsModal;
