import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { AlertCircle, Settings, X } from 'lucide-react';
import { COLORS } from '../constants/colors';
import API from '../services/API';

const AcademicSessionWarningModal = () => {
  const [showModal, setShowModal] = useState(false);
  const { props } = usePage();
  const user = props.auth?.user;

  useEffect(() => {
    // Only check for admin/teacher users
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      return;
    }

    // Check academic session from shared data or make a request
    checkAcademicSession();
  }, [user]);

  const checkAcademicSession = async () => {
    try {
      // Use API service to fetch current session (not Inertia router)
      const response = await API.getCurrentAcademicSession();
      const data = response.data || {};
      
      if (!data.has_session || !data.has_term) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (error) {
      // Show modal if API call fails
      setShowModal(true);
    }
  };

  // Don't show modal if not admin/teacher
  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return null;
  }

  const handleGoToSettings = () => {
    setShowModal(false);
    router.visit('/admin/settings');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Academic Session Required
            </h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">
              Before you can start using the platform, you need to set up an academic session and term.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Action Required:</strong> Please configure academic session and term in Settings.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>What to do:</strong>
            </p>
            <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal space-y-1">
              <li>Go to Settings</li>
              <li>Open the "Academic Sessions" tab</li>
              <li>Create a new academic session (e.g., 2024/2025)</li>
              <li>Set it as the current session</li>
              <li>Set one of its terms as the current term</li>
            </ol>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
          >
            I'll do it later
          </button>
          <button
            onClick={handleGoToSettings}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: COLORS.primary.red }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicSessionWarningModal;
