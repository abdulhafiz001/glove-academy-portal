import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { COLORS } from '../../constants/colors';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: verify identity, 2: reset password
  const [formData, setFormData] = useState({
    admission_number_or_email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const { errors } = usePage().props;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVerifyIdentity = (e) => {
    e.preventDefault();
    setLoading(true);

    router.post('/student/forgot-password/verify', {
      admission_number_or_email: formData.admission_number_or_email
    }, {
      onSuccess: (page) => {
        setStudentInfo(page.props.studentInfo || page.props.data);
        setStep(2);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
      onFinish: () => setLoading(false),
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    setLoading(true);

    router.post('/student/forgot-password/reset', formData, {
      onSuccess: () => {
        router.visit('/auth/student/login');
      },
      onError: () => {
        setLoading(false);
      },
      onFinish: () => setLoading(false),
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-start mb-2">
          <Link href="/auth/student/login" className="inline-flex items-center hover:underline text-sm font-medium"
                style={{ color: COLORS.primary.blue }}>
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>
        <Link href="/" className="flex justify-center">
          <img src="/images/G-LOVE ACADEMY.jpeg" alt="G-LOVE ACADEMY Logo" className="h-20 w-auto mx-auto" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-4">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 
            ? 'Enter your admission number or email to verify your identity'
            : 'Create a new password for your account'}
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

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleVerifyIdentity}>
              <div>
                <label htmlFor="admission_number_or_email" className="block text-sm font-medium text-gray-700">
                  Admission Number or Email
                </label>
                <div className="mt-1">
                  <input
                    id="admission_number_or_email"
                    name="admission_number_or_email"
                    type="text"
                    required
                    value={formData.admission_number_or_email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                    style={{ 
                      focusRingColor: COLORS.primary.red,
                      focusBorderColor: COLORS.primary.red 
                    }}
                    placeholder="Enter your admission number or email"
                  />
                </div>
                {errors?.admission_number_or_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.admission_number_or_email}</p>
                )}
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
                  {loading ? 'Verifying...' : 'Verify Identity'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {studentInfo && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Student:</strong> {studentInfo.first_name} {studentInfo.last_name}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Admission Number: {studentInfo.admission_number}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                    style={{ 
                      focusRingColor: COLORS.primary.red,
                      focusBorderColor: COLORS.primary.red 
                    }}
                    placeholder="Enter your new password (min. 6 characters)"
                  />
                </div>
                {errors?.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                    style={{ 
                      focusRingColor: COLORS.primary.red,
                      focusBorderColor: COLORS.primary.red 
                    }}
                    placeholder="Confirm your new password"
                  />
                </div>
                {errors?.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      admission_number_or_email: formData.admission_number_or_email,
                      password: '',
                      password_confirmation: ''
                    });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  } transition-all duration-200`}
                  style={{ 
                    backgroundColor: COLORS.primary.red,
                    focusRingColor: COLORS.primary.red 
                  }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/student/login"
              className="text-sm font-medium hover:underline"
              style={{ color: COLORS.primary.blue }}
            >
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
