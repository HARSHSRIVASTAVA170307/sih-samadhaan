import { motion } from 'framer-motion';
import { Lightbulb, Zap, TrendingUp, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AdaptiveRecommendations = ({ progress, roadmap }) => {
    if (!progress || !roadmap) return null;

    const { completed_phases = 0, total_phases = 0, streak_days = 0 } = progress;
    const completionRate = total_phases > 0 ? (completed_phases / total_phases) * 100 : 0;

    const generateRecommendations = () => {
        const recommendations = [];

        if (completionRate < 20 && streak_days < 3) {
            recommendations.push({
                type: 'pace',
                icon: Zap,
                title: 'Build Momentum',
                message: 'Start with small daily goals. Even 30 minutes a day can build a strong learning habit.',
                color: 'orange',
            });
        } else if (completionRate > 50 && streak_days > 7) {
            recommendations.push({
                type: 'pace',
                icon: TrendingUp,
                title: 'Excellent Progress!',
                message: `You're on fire! ${streak_days} days streak. Keep this momentum going!`,
                color: 'green',
            });
        } else if (streak_days > 0) {
            recommendations.push({
                type: 'pace',
                icon: Target,
                title: 'Stay Consistent',
                message: `${streak_days} day streak! Consistency is key to mastering new skills.`,
                color: 'blue',
            });
        }

        if (roadmap?.roadmap && roadmap.roadmap.length > 0) {
            const currentPhase = roadmap.roadmap[completed_phases];
            if (currentPhase) {
                recommendations.push({
                    type: 'resource',
                    icon: BookOpen,
                    title: 'Focus Area',
                    message: `Current phase: ${currentPhase.phase}. Focus on ${currentPhase.focus_skills?.slice(0, 2).join(' and ')}.`,
                    color: 'purple',
                });
            }
        }

        if (completionRate > 75) {
            recommendations.push({
                type: 'motivation',
                icon: Lightbulb,
                title: 'Almost There!',
                message: "You're in the final stretch! This is where your hard work pays off.",
                color: 'indigo',
            });
        }

        return recommendations;
    };

    const recommendations = generateRecommendations();

    if (recommendations.length === 0) {
        return null;
    }

    const getColorClasses = (color) => {
        const colors = {
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-500/10',
                border: 'border-orange-200 dark:border-orange-600',
                icon: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
            },
            green: {
                bg: 'bg-green-50 dark:bg-green-500/10',
                border: 'border-green-200 dark:border-green-600',
                icon: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
            },
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-500/10',
                border: 'border-blue-200 dark:border-blue-600',
                icon: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-500/10',
                border: 'border-purple-200 dark:border-purple-600',
                icon: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
            },
            indigo: {
                bg: 'bg-indigo-50 dark:bg-indigo-500/10',
                border: 'border-indigo-200 dark:border-indigo-600',
                icon: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm mb-8 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800/50 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg font-bold text-gray-900 dark:text-white">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-md">
                        <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    Personalized Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-4 sm:pt-6">
                {recommendations.length > 0 ? (
                    recommendations.map((rec, idx) => {
                        const Icon = rec.icon;
                        const colors = getColorClasses(rec.color);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                className={`group p-4 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-sm transition-shadow`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-lg shrink-0 ${colors.icon}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
                                            {rec.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {rec.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No new recommendations at the moment.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AdaptiveRecommendations;
