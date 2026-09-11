import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { auth } from '../firebase'
import {
  Briefcase, ExternalLink, MapPin, Clock, Building2,
  Loader2, RefreshCw, Tag, Search
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const JobListings = ({ career }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchJobs = async (searchCareer) => {
    if (!searchCareer) return
    setLoading(true)
    setError(null)
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.get(`${API_URL}/api/jobs/search`, {
        params: { career: searchCareer, limit: 8 },
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(response.data.jobs || [])
      setSearchTerm(response.data.search_term || searchCareer)
    } catch (err) {
      setError('Failed to load jobs. Try again later.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (career) {
      fetchJobs(career)
    }
  }, [career])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff}d ago`
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`
    return `${Math.floor(diff / 30)}mo ago`
  }

  if (!career) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Live Job Openings
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time from Remotive • Matching "{career}"
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchJobs(career)}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm text-gray-500">Fetching live jobs...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => fetchJobs(career)}
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-6">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No jobs found for this career.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job, idx) => (
              <motion.a
                key={job.id || idx}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group block p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  {/* Company Logo */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                          {job.company}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {job.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {job.location.length > 30 ? job.location.substring(0, 30) + '...' : job.location}
                        </span>
                      )}
                      {job.job_type && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <Briefcase className="w-3 h-3" />
                          {job.job_type.replace('_', ' ')}
                        </span>
                      )}
                      {job.published_date && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(job.published_date)}
                        </span>
                      )}
                    </div>

                    {job.tags && job.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {job.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && jobs.length > 0 && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
            Powered by Remotive API • Showing {jobs.length} live remote openings
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default JobListings
