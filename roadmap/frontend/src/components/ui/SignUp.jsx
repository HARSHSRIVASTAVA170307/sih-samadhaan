import { useState } from 'react';
import { Eye, EyeOff, Linkedin, Compass, Moon, Sun } from 'lucide-react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C37.205 35.092 44 29.894 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const checkProfileCompletion = async (user) => {
    try {
      const idToken = await user.getIdToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await axios.get(
        `${API_URL}/api/students/profile`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.name && response.data.education) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/profile-setup');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const hasProfile = await checkProfileCompletion(user);

      if (hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans w-full bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8 relative">
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[9999] p-3 rounded-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-zinc-600 shadow-2xl hover:scale-110 transition-all duration-200"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun className="h-6 w-6 text-yellow-400" />
        ) : (
          <Moon className="h-6 w-6 text-indigo-600" />
        )}
      </button>

      <div className="mb-6 sm:mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
            <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">SkillRoute</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">Your personalized learning journey</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-300 font-medium">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400 focus:border-black dark:focus:border-indigo-500 focus:ring-black dark:focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400 focus:border-black dark:focus:border-indigo-500 focus:ring-black dark:focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400 focus:border-black dark:focus:border-indigo-500 focus:ring-black dark:focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-md"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-gray-400 dark:text-gray-500 font-semibold">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full bg-white dark:bg-transparent border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
          >
            <GoogleIcon />
            <span className="ml-2">Google</span>
          </Button>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium mt-4">
            Already have an account?{' '}
            <button onClick={handleSignIn} className="text-black dark:text-indigo-400 hover:text-gray-700 dark:hover:text-indigo-300 font-bold hover:underline">
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center animate-fade-in w-full md:max-w-md">
        <div className="border-2 border-gray-200 dark:border-zinc-700 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-xl">
          <p className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold mb-4 uppercase tracking-wider">Developed by</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 pr-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">HJ</div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">Haridharshini J</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Full Stack Dev</p>
              </div>
              <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0077b5] transition-colors" />
            </a>

            <a href="https://www.linkedin.com/in/dheebash-sai-ramesh-563b96320/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 pr-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">DS</div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">Dheebash Sai</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Full Stack Dev</p>
              </div>
              <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0077b5] transition-colors" />
            </a>

            <a href="https://www.linkedin.com/in/bala-saravanan-k/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 pr-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">BS</div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">Bala Saravanan K</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Web Designer</p>
              </div>
              <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0077b5] transition-colors" />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 pr-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">TV</div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">Thanushree V</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Backend Dev</p>
              </div>
              <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0077b5] transition-colors" />
            </a>


          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
