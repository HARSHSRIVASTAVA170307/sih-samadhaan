import { useState, useEffect, useRef, useCallback } from 'react'
import { auth } from '../firebase'
import { useToast } from '../contexts/ToastContext'
import axios from 'axios'
import { Bot } from 'lucide-react'

export const useDashboardData = () => {
    const [profile, setProfile] = useState(null)
    const [roadmap, setRoadmap] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationMode, setGenerationMode] = useState(null)

    const autoAdaptShown = useRef(false)
    const toast = useToast()

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    const loadProfile = useCallback(async (signal) => {
        try {
            const token = await auth.currentUser.getIdToken()
            const response = await axios.get(`${API_URL}/api/students/profile`, {
                headers: { Authorization: `Bearer ${token}` },
                signal
            })
            if (response.data && !response.data.message) {
                setProfile(response.data)
            }
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ECONNABORTED') {
                console.error('Profile load error:', err)
                setError(prev => ({ ...prev, profile: err.message }))
            }
        }
    }, [API_URL])

    const loadRoadmap = useCallback(async (signal) => {
        try {
            const token = await auth.currentUser.getIdToken()
            const response = await axios.get(`${API_URL}/api/career/roadmap`, {
                headers: { Authorization: `Bearer ${token}` },
                signal
            })

            if (response.data && !response.data.message) {
                setRoadmap(response.data)

                // Auto-adapt detection
                if (response.data.needs_adaptation && !autoAdaptShown.current) {
                    autoAdaptShown.current = true
                    toast.info({
                        title: (
                            <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4" />
                                <span>Agent Suggestion</span>
                            </div>
                        ),
                        description: response.data.adaptation_reason || 'Your progress seems stalled. Want the agent to adapt your roadmap?',
                        action: {
                            label: 'Adapt Now',
                            onClick: () => window.dispatchEvent(new CustomEvent('triggerAdapt'))
                        }
                    })
                }
            } else {
                setRoadmap(null)
            }
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ECONNABORTED') {
                // If 404, it might just mean no roadmap exists yet, which is fine
                if (err.response && err.response.status === 404) {
                    setRoadmap(null)
                } else {
                    console.error('Roadmap load error:', err)
                    setError(prev => ({ ...prev, roadmap: err.message }))
                }
            }
        }
    }, [API_URL, toast])

    const generateRoadmap = async () => {
        if (!profile) return false

        setLoading(true)
        setIsGenerating(true)
        setGenerationMode('generate')
        try {
            const token = await auth.currentUser.getIdToken()
            const response = await axios.post(`${API_URL}/api/career/roadmap`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRoadmap(response.data)
            toast.success('Roadmap generated successfully!')
            return true
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.message || 'An error occurred'
            toast.error(`Failed to generate roadmap: ${errorMsg}`)
            return false
        } finally {
            setLoading(false)
            setIsGenerating(false)
            setGenerationMode(null)
        }
    }

    const adaptRoadmap = async () => {
        setLoading(true)
        setIsGenerating(true)
        setGenerationMode('adapt')
        try {
            const token = await auth.currentUser.getIdToken()
            await axios.post(`${API_URL}/api/progress/adapt`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            await loadRoadmap()
            toast.success({
                title: 'Roadmap Adapted',
                description: 'Your learning path has been updated based on your recent progress.'
            })
            return true
        } catch (err) {
            toast.error('Failed to adapt roadmap. Please try again.')
            return false
        } finally {
            setLoading(false)
            setIsGenerating(false)
            setGenerationMode(null)
        }
    }

    const resetCareerPath = async () => {
        setLoading(true)
        try {
            const token = await auth.currentUser.getIdToken()
            await axios.delete(`${API_URL}/api/career/roadmap`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRoadmap(null)
            toast.success('Career path reset successfully!')
            return true
        } catch (err) {
            toast.error('Failed to reset career path.')
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)

        Promise.all([
            loadProfile(controller.signal),
            loadRoadmap(controller.signal)
        ]).finally(() => {
            setLoading(false)
        })

        return () => controller.abort()
    }, [loadProfile, loadRoadmap])

    const refreshData = async () => {
        setLoading(true)
        await Promise.all([loadProfile(), loadRoadmap()])
        setLoading(false)
    }

    return {
        profile,
        roadmap,
        loading,
        error,
        isGenerating,
        generationMode,
        generateRoadmap,
        adaptRoadmap,
        resetCareerPath,
        refreshData
    }
}
