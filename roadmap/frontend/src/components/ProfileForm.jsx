import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const ProfileForm = ({ initialData, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: '',
    interests: '',
    goals: '',
    experience: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }))
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Tell us about yourself to get personalized career guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education Level</Label>
          <Select 
            value={formData.education} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="bootcamp">Bootcamp/Certificate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Current Skills</Label>
        <Textarea
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          required
          rows={3}
          placeholder="e.g., Python, React, Data Analysis, Project Management"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Career Interests</Label>
        <Textarea
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          required
          rows={3}
          placeholder="e.g., Software Development, Data Science, AI/ML, UX Design"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Career Goals</Label>
        <Textarea
          id="goals"
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          required
          rows={3}
          placeholder="e.g., Become a Senior Developer, Start a tech company, Work in AI research"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience (if any)</Label>
        <Textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., 2 years as Junior Developer, Internship at XYZ Company"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
