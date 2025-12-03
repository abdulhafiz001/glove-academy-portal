import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { COLORS } from '../../constants/colors';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    admission_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { errors } = usePage().props;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    router.post('/auth/student/login', formData, {
      onFinish: () => setLoading(false),
      onError: () => setLoading(false),
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-start mb-2">
          <Link href="/" className="inline-flex items-center hover:underline text-sm font-medium"
                style={{ color: COLORS.primary.blue }}>
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        <Link href="/" className="flex justify-center">
          <img src="/images/G-LOVE ACADEMY.jpeg" alt="G-LOVE ACADEMY Logo" className="h-20 w-auto mx-auto" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-4">
          G-LOVE ACADEMY Student Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your academic results and progress
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-gray-200 sm:rounded-lg sm:px-10">
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {Object.values(errors).flat().map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admission_number" className="block text-sm font-medium text-gray-700">
                Admission Number
              </label>
              <div className="mt-1">
                <input
                  id="admission_number"
                  name="admission_number"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.admission_number}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{ 
                    focusRingColor: COLORS.primary.red,
                    focusBorderColor: COLORS.primary.red 
                  }}
                  placeholder="Enter your admission number"
                />
              </div>
              {errors?.admission_number && (
                <p className="mt-1 text-sm text-red-600">{errors.admission_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{ 
                    focusRingColor: COLORS.primary.red,
                    focusBorderColor: COLORS.primary.red 
                  }}
                  placeholder="Enter your password"
                />
              </div>
              {errors?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-2"
                  style={{ accentColor: COLORS.primary.red }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/student/forgot-password"
                  className="font-medium hover:underline"
                  style={{ color: COLORS.primary.blue }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                } transition-all duration-200`}
                style={{ 
                  backgroundColor: COLORS.primary.red,
                  focusRingColor: COLORS.primary.red 
                }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-red-300 group-hover:text-red-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {loading ? 'Signing in...' : 'Access My Results'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact your school administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
