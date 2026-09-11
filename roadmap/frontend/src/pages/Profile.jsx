import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import { cache } from '../lib/cache';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  ChevronLeft,
  Save,
  Sparkles,
  Globe,
  Smartphone,
  Brain,
  BarChart3,
  Cloud,
  Shield,
  Settings,
  Gamepad2,
  Link2,
  Radio,
  Palette,
  Code2,
  Compass,
  Clock,
  Zap,
  Gauge,
  Rocket
} from 'lucide-react';

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Bootcamp',
  'Self-Taught',
  'Other'
];

const SKILL_OPTIONS = [
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' },
  { name: 'C++', category: 'Languages' },
  { name: 'C#', category: 'Languages' },
  { name: 'Go', category: 'Languages' },
  { name: 'Rust', category: 'Languages' },
  { name: 'PHP', category: 'Languages' },
  { name: 'Ruby', category: 'Languages' },
  { name: 'Swift', category: 'Languages' },
  { name: 'Kotlin', category: 'Languages' },

  { name: 'React', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'HTML/CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },

  { name: 'Node.js', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: '.NET', category: 'Backend' },

  { name: 'SQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Firebase', category: 'Database' },

  { name: 'AWS', category: 'Cloud/DevOps' },
  { name: 'Azure', category: 'Cloud/DevOps' },
  { name: 'GCP', category: 'Cloud/DevOps' },
  { name: 'Docker', category: 'Cloud/DevOps' },
  { name: 'Kubernetes', category: 'Cloud/DevOps' },
  { name: 'CI/CD', category: 'Cloud/DevOps' },
  { name: 'Git', category: 'Cloud/DevOps' },

  { name: 'Machine Learning', category: 'Data/AI' },
  { name: 'TensorFlow', category: 'Data/AI' },
  { name: 'PyTorch', category: 'Data/AI' },
  { name: 'Data Analysis', category: 'Data/AI' },
  { name: 'Pandas', category: 'Data/AI' },
  { name: 'NumPy', category: 'Data/AI' },
];

const DOMAIN_OPTIONS = [
  { name: 'Web Development', trending: true, icon: Globe },
  { name: 'Mobile Development', trending: true, icon: Smartphone },
  { name: 'AI/Machine Learning', trending: true, icon: Brain },
  { name: 'Data Science', trending: true, icon: BarChart3 },
  { name: 'Cloud Computing', trending: true, icon: Cloud },
  { name: 'Cybersecurity', trending: false, icon: Shield },
  { name: 'DevOps', trending: true, icon: Settings },
  { name: 'Game Development', trending: false, icon: Gamepad2 },
  { name: 'Blockchain', trending: false, icon: Link2 },
  { name: 'IoT', trending: false, icon: Radio },
  { name: 'UI/UX Design', trending: false, icon: Palette },
  { name: 'Full Stack Development', trending: true, icon: Code2 },
];

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [],
    interests: [],
    goals: '',
    experience: '',
    time_per_week: 10,
    learning_pace: 'medium'
  });
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Check cache first
      const cachedProfile = cache.get('studentProfile');
      if (cachedProfile) {
        setFormData(cachedProfile);
        setLoading(false);
        return;
      }

      const token = await auth.currentUser.getIdToken();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await axios.get(`${API_URL}/api/students/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });

        if (response.data && !response.data.message) {
          const profileData = {
            name: response.data.name || '',
            education: response.data.education || '',
            skills: response.data.skills ? response.data.skills.split(', ').filter(s => s) : [],
            interests: response.data.interests ? response.data.interests.split(', ').filter(i => i) : [],
            goals: response.data.goals || '',
            experience: response.data.experience || '',
            time_per_week: response.data.time_per_week || 10,
            learning_pace: response.data.learning_pace || 'medium'
          };
          setFormData(profileData);
          cache.set('studentProfile', profileData, 10); // Cache for 10 minutes
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      if (error.code !== 'ECONNABORTED' && error.name !== 'AbortError') {
        const errorMsg = error.response?.data?.detail || error.message || 'Unknown error'
        console.error('Profile load error:', errorMsg, error)
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(s => s !== skillName)
        : [...prev.skills, skillName]
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const toggleInterest = (interestName) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestName)
        ? prev.interests.filter(i => i !== interestName)
        : [...prev.interests, interestName]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('⚠️ Please enter your name');
      return;
    }
    if (!formData.education) {
      toast.error('⚠️ Please select your education level');
      return;
    }
    if (formData.skills.length === 0) {
      toast.error('⚠️ Please select at least one skill');
      return;
    }
    if (formData.interests.length === 0) {
      toast.error('⚠️ Please select at least one career interest');
      return;
    }
    if (!formData.goals.trim()) {
      toast.error('⚠️ Please enter your career goals');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!auth.currentUser) {
        toast.error('⚠️ You must be logged in to save your profile');
        navigate('/login');
        return;
      }

      const token = await auth.currentUser.getIdToken();

      const profileData = {
        name: formData.name.trim(),
        education: formData.education,
        skills: formData.skills.join(', '),
        interests: formData.interests.join(', '),
        goals: formData.goals.trim(),
        experience: formData.experience ? formData.experience.trim() : '',
        time_per_week: formData.time_per_week,
        learning_pace: formData.learning_pace
      };

      const response = await axios.post(`${API_URL}/api/students/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear cache when profile is updated
      cache.clear('studentProfile');

      toast.success('✅ Profile saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Failed to save profile. ';

      if (error.response) {
        errorMessage += error.response.data.detail || error.response.data.message || 'Please try again.';
      } else if (error.request) {
        errorMessage += 'Unable to reach the server. Please check your connection.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsByCategory = SKILL_OPTIONS.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 transition-colors">
      <div className="mb-6 sm:mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Edit Profile</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">Update your information and preferences</p>
      </div>

      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-xl dark:shadow-none border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
          <CardHeader className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Keep your profile up to date for better career recommendations
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 md:p-6 space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 sm:space-y-4"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-zinc-800">Basic Information</h3>
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="education" className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                  <SelectTrigger className="mt-1.5 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white/20 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level} value={level} className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-zinc-700">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 sm:space-y-5"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-zinc-800">Skills</h3>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">{category}</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${formData.skills.includes(skill)
                          ? 'bg-black dark:bg-white text-white dark:text-black shadow-md border-transparent'
                          : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white border-gray-200 dark:border-zinc-700'
                          }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                <Label className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Add Custom Skill</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    placeholder="Type a skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <Button onClick={addCustomSkill} type="button" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">Add</Button>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Selected Skills ({formData.skills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs sm:text-sm font-semibold shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-5"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-zinc-800">Career Interests</h3>
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide">Trending Domains</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                  {DOMAIN_OPTIONS.filter(d => d.trending).map((domain) => {
                    const IconComponent = domain.icon;
                    const isSelected = formData.interests.includes(domain.name);
                    return (
                      <button
                        key={domain.name}
                        type="button"
                        onClick={() => toggleInterest(domain.name)}
                        className={`p-2.5 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${isSelected
                          ? 'border-black dark:border-white bg-gray-50 dark:bg-zinc-800 shadow-md transform scale-[1.02]'
                          : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/20 hover:shadow-sm'
                          }`}
                      >
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 mx-auto ${isSelected ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-500'}`} />
                        <div className={`text-center leading-tight ${isSelected ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>{domain.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-300 mb-2.5 uppercase tracking-wide">Other Domains</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                  {DOMAIN_OPTIONS.filter(d => !d.trending).map((domain) => {
                    const IconComponent = domain.icon;
                    const isSelected = formData.interests.includes(domain.name);
                    return (
                      <button
                        key={domain.name}
                        type="button"
                        onClick={() => toggleInterest(domain.name)}
                        className={`p-2.5 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${isSelected
                          ? 'border-black dark:border-white bg-gray-50 dark:bg-zinc-800 shadow-md transform scale-[1.02]'
                          : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/20 hover:shadow-sm'
                          }`}
                      >
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 mx-auto ${isSelected ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-500'}`} />
                        <div className={`text-center leading-tight ${isSelected ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>{domain.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                <Label className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Add Custom Interest</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    placeholder="Type an interest..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <Button onClick={addCustomInterest} type="button" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">Add</Button>
                </div>
              </div>

              {formData.interests.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Selected Interests ({formData.interests.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs sm:text-sm font-semibold shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-zinc-800">Goals & Experience</h3>
              <div>
                <Label htmlFor="goals" className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Career Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What are your career goals? Where do you want to be in 2-3 years?"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="mt-1.5 min-h-[100px] sm:min-h-[120px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Experience (Optional)</Label>
                <Textarea
                  id="experience"
                  placeholder="Tell us about your relevant experience, projects, or achievements..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="mt-1.5 min-h-[80px] sm:min-h-[100px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Time Availability */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <Label className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Time Available Per Week</Label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={formData.time_per_week}
                    onChange={(e) => setFormData({ ...formData, time_per_week: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
                    {formData.time_per_week}h
                  </span>
                </div>
              </div>

              {/* Learning Pace */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <Label className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-200">Learning Pace</Label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: 'slow', label: 'Slow & Steady', icon: Gauge }, { value: 'medium', label: 'Balanced', icon: Zap }, { value: 'fast', label: 'Fast Track', icon: Rocket }].map(pace => {
                    const PaceIcon = pace.icon;
                    return (
                    <button
                      key={pace.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, learning_pace: pace.value })}
                      className={`p-3 rounded-xl text-center transition-all duration-200 border-2 ${formData.learning_pace === pace.value
                          ? 'border-black dark:border-white bg-gray-50 dark:bg-zinc-800 shadow-md'
                          : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/20'
                        }`}
                    >
                      <PaceIcon className={`w-6 h-6 mx-auto mb-1 ${formData.learning_pace === pace.value ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{pace.label}</p>
                    </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end gap-3 pt-4 sm:pt-5 border-t border-gray-100 dark:border-zinc-800">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                type="button"
                className="text-xs sm:text-sm px-4 border-gray-300 dark:border-zinc-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                type="button"
                className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-xs sm:text-sm px-6 shadow-md"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
                <Save className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
