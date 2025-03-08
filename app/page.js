'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './utils/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

// Admin Login component for signing into the dashboard.
// This component handles form state, authentication, and navigation.
export default function Login() {
  // useRouter enables navigation after successful login
  const router = useRouter();
  
  // State to hold the login form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // State to manage error messages
  const [error, setError] = useState('');
  
  // State to handle loading status during login operations
  const [loading, setLoading] = useState(false);

  // handleSubmit handles the form submission.
  // creates a login token, and navigates to the dashboard if successful.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get admin data from Firestore using document ID '116'
      const adminRef = doc(db, 'Admin', '116');
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        // Check if provided credentials match the admin data
        if (adminData.name === formData.username && adminData.password === formData.password) {
          // Create a token with a Base64-encoded string valid for 1 day
          const token = btoa(
            JSON.stringify({
              username: adminData.name,
              admin: true,
              role: adminData.role, // admin role from Firestore
              exp: Date.now() + 86400000, // token valid for 1 day (in milliseconds)
            })
          );
          // Store the token in localStorage and navigate to the dashboard
          localStorage.setItem('adminToken', token);
          router.push('/dashboard');
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('Admin not found');
      }
    } catch (error) {
      // Print error details in the console and display a generic message to the user
      setError('Error checking credentials');
      console.error(error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  // handleChange updates form data as the user types and clears the error state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // handleFilterChange stores the selected emergency filter in localStorage
  const handleFilterChange = (e) => {
    const { value } = e.target;
    localStorage.setItem('emergencyFilter', value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        {/* Header section with title and instructions */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access dashboard
          </p>
        </div>
        {/* Conditional rendering for error messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        {/* Login form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {/* Password field */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* Emergency filter select field */}
            <div>
              <label htmlFor="emergencyFilter" className="text-sm font-medium text-gray-300">
                Emergency Filter
              </label>
              <select
                id="emergencyFilter"
                name="emergencyFilter"
                defaultValue=""
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="" disabled>Select filter</option>
                <option value="fire">Fire</option>
                <option value="SOS Alert">SOS</option>
                <option value="police">Police</option>
                <option value="medical">Medical</option>
              </select>
            </div>
          </div>
          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}