import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const icons = {
        success: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />,
        error: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
        info: <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    };

    const bgColors = {
        success: 'bg-white dark:bg-zinc-900 border-green-500 shadow-green-500/20',
        error: 'bg-white dark:bg-zinc-900 border-red-500 shadow-red-500/20',
        info: 'bg-white dark:bg-zinc-900 border-blue-500 shadow-blue-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="w-full max-w-md mx-auto"
        >
            <div className={`${bgColors[type]} border-2 rounded-2xl shadow-2xl p-5`}>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <div className="flex-1 min-w-0">
                        {typeof message === 'string' ? (
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                                {message}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {message.title && (
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {message.title}
                                    </p>
                                )}
                                {message.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {message.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <div key={toast.id} className="mb-3">
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToastContainer;
