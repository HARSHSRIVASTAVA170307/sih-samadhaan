import { motion } from 'framer-motion';
import {
    UserCircle,
    Search,
    BarChart3,
    CheckCircle2,
    Map,
    ChevronRight,
    Brain
} from 'lucide-react';

const TRACE_STEPS = [
    { key: 'Input Analysis', icon: UserCircle, color: 'blue', label: 'Input Received' },
    { key: 'Paths Evaluated', icon: Search, color: 'purple', label: 'Careers Evaluated' },
    { key: 'Comparison', icon: BarChart3, color: 'amber', label: 'Comparison' },
    { key: 'Decision', icon: CheckCircle2, color: 'emerald', label: 'Decision Made' },
    { key: 'Plan Strategy', icon: Map, color: 'indigo', label: 'Plan Generated' },
];

const colorMap = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
        line: 'bg-blue-300 dark:bg-blue-700',
        dot: 'bg-blue-500',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        border: 'border-purple-200 dark:border-purple-800',
        icon: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
        line: 'bg-purple-300 dark:bg-purple-700',
        dot: 'bg-purple-500',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
        line: 'bg-amber-300 dark:bg-amber-700',
        dot: 'bg-amber-500',
    },
    emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        line: 'bg-emerald-300 dark:bg-emerald-700',
        dot: 'bg-emerald-500',
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        border: 'border-indigo-200 dark:border-indigo-800',
        icon: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
        line: 'bg-indigo-300 dark:bg-indigo-700',
        dot: 'bg-indigo-500',
    },
};

const AgentDecisionTrace = ({ decisionTrace }) => {
    if (!decisionTrace || decisionTrace.length === 0) return null;

    // Map trace data from API to display steps
    const traceMap = {};
    decisionTrace.forEach(item => {
        traceMap[item.step] = item.detail;
    });

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
                    <Brain className="w-4 h-4 text-white dark:text-black" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Agent Decision Trace</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">How SkillRoute AgentX made this decision</p>
                </div>
            </div>

            <div className="space-y-0">
                {TRACE_STEPS.map((step, idx) => {
                    const detail = traceMap[step.key];
                    const colors = colorMap[step.color];
                    const Icon = step.icon;
                    const isLast = idx === TRACE_STEPS.length - 1;

                    return (
                        <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.15 }}
                            className="relative"
                        >
                            <div className="flex gap-3">
                                {/* Timeline line + dot */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${colors.icon} flex-shrink-0 z-10`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {!isLast && (
                                        <div className={`w-0.5 flex-1 my-1 ${colors.line} min-h-[16px]`} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`flex-1 p-3 rounded-lg border ${colors.bg} ${colors.border} mb-2`}>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Step {idx + 1}: {step.label}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {detail || 'Processing...'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentDecisionTrace;
