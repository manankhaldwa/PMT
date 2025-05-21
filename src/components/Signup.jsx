import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiX, FiCheck } from 'react-icons/fi';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const suggestions = [];
    if (password.length >= 8) strength += 1; else suggestions.push('At least 8 characters');
    if (/[A-Z]/.test(password)) strength += 1; else suggestions.push('At least one uppercase letter');
    if (/[a-z]/.test(password)) strength += 1; else suggestions.push('At least one lowercase letter');
    if (/[0-9]/.test(password)) strength += 1; else suggestions.push('At least one number');
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; else suggestions.push('At least one special character');
    setPasswordStrength(strength);
    setPasswordSuggestions(suggestions);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setIsSuccess(false);

  try {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) throw new Error('Please fill in all fields');
    if (password !== confirmPassword) throw new Error('Passwords do not match');
    if (passwordStrength < 3) throw new Error('Password is too weak');

    // Step 1: Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Step 2: Redirect early (before long async tasks)
    setIsSuccess(true);
    navigate('/');

    // Step 3: Run post-account-creation tasks in the background
    updateProfile(userCredential.user, { displayName: name }).catch(console.error);
    setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
      role: 'user',
      lastLogin: serverTimestamp()
    }).catch(console.error);

  } catch (err) {
    let errorMessage = 'Registration failed';
    switch (err.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email already in use';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      default:
        errorMessage = err.message;
    }
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthWidth = () => `${(passwordStrength / 5) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            {isSuccess ? 'Account Created!' : 'Create Account'}
          </h2>
          <p className="text-blue-100 mt-1">
            {isSuccess ? 'You can now log in to your account' : 'Join and explore your dashboard'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FiX className="h-5 w-5 text-red-500" />
                <div className="ml-3"><p className="text-sm text-red-700">{error}</p></div>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FiCheck className="h-5 w-5 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Account created successfully! Redirecting to login page in 3 seconds...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    className="pl-10 w-full py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="John Doe" required />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                    className="pl-10 w-full py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="you@example.com" required />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-2.5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    className="pl-10 pr-10 w-full py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>

                {/* Strength meter */}
                {formData.password && (
                  <>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className={`${getPasswordStrengthColor()} h-full`} style={{ width: getPasswordStrengthWidth() }} />
                    </div>
                    <div className="text-xs text-gray-500">Strength: {passwordStrength}/5</div>
                    <ul className="text-xs text-gray-500 list-disc pl-5 mt-1">
                      {passwordSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="password" id="confirmPassword" name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange}
                    className="pl-10 w-full py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : 'Sign Up'}
              </button>
            </form>
          )}

          <p className="text-lg text-center text-gray-600">
            {isSuccess ? (
              <span>Redirecting to login page...</span>
            ) : (
              <>
                Already have an account? <Link to="/" className="text-indigo-600 font-medium hover:underline">Log in</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;