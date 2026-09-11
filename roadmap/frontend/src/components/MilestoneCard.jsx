import { motion } from 'framer-motion';
import { Check, Clock, BookOpen, ExternalLink, PlayCircle } from 'lucide-react';

const MilestoneCard = ({ milestone, phaseIndex, milestoneIndex, onComplete, isCompleted }) => {
    if (!milestone) return null;

    const {
        name,
        description,
        estimated_hours = 0,
        resources = [],
    } = milestone;

    const getResourceIcon = (type) => {
        switch (type) {
            case 'course':
                return <PlayCircle className="w-4 h-4" />;
            case 'documentation':
                return <BookOpen className="w-4 h-4" />;
            case 'video':
                return <PlayCircle className="w-4 h-4" />;
            default:
                return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getResourceColor = (type) => {
        switch (type) {
            case 'course':
                return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20';
            case 'documentation':
                return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20';
            case 'project':
                return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20';
            case 'video':
                return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20';
            default:
                return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: milestoneIndex * 0.1 }}
            className={`p-5 rounded-xl border-2 transition-all duration-300 ${isCompleted
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-600'
                    : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <div className="flex items-start gap-3">
                        <div
                            className={`mt-1 p-2 rounded-lg ${isCompleted
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-zinc-700'
                                }`}
                        >
                            {isCompleted ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {milestoneIndex + 1}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                        </div>
                    </div>
                </div>

                {/* Time Estimate */}
                {estimated_hours > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{estimated_hours}h</span>
                    </div>
                )}
            </div>

            {/* Resources */}
            {resources.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Learning Resources
                    </p>
                    <div className="space-y-2">
                        {resources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                            {resource.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {resource.type}
                                            </span>
                                            {resource.duration && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {resource.duration}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Complete Button */}
            {!isCompleted && onComplete && (
                <button
                    onClick={() => onComplete(phaseIndex, milestoneIndex)}
                    className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    Mark as Complete
                </button>
            )}
        </motion.div>
    );
};

export default MilestoneCard;
