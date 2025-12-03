import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import API from '../../services/API';
import debug from '../../utils/debug';
import AppLayout from '../../layouts/AppLayout';

const StudentProfile = ({ student: initialStudent }) => {
  const { props } = usePage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user: authUser } = useAuth();
  const { showError, showSuccess } = useNotification();
  
  // Use student from props or auth context
  const student = initialStudent || props.student || authUser;
  
  const [formData, setFormData] = useState({
    email: student?.email || '',
    phone: student?.phone || '',
    address: student?.address || '',
    parentName: student?.parent_name || '',
    parentPhone: student?.parent_phone || '',
    parentEmail: student?.parent_email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [admissionSession, setAdmissionSession] = useState(null);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await API.getCurrentAcademicSession();
        const data = response.data || response;
        if (data.session) setCurrentSession(data.session);
        if (data.admission_session) setAdmissionSession(data.admission_session);
      } catch (error) {
        // Silently handle errors - don't show error or redirect
        // This prevents logout when API call fails
        debug.error('Error fetching session info:', error);
      }
    };
    fetchSessionInfo();
  }, []);

  const displayUser = student || authUser;
  
  const studentInfo = {
    admissionNumber: displayUser?.admission_number || 'Loading...',
    class: displayUser?.school_class?.name || 'Loading...',
    session: currentSession?.name || 'Not Set',
    dateAdmitted: displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString() : 'Loading...',
    admissionSession: admissionSession?.name || 'N/A',
    studentId: displayUser?.id || 'Loading...',
    bloodGroup: displayUser?.blood_group || 'N/A',
    genotype: displayUser?.genotype || 'N/A',
    religion: displayUser?.religion || 'N/A',
    stateOfOrigin: displayUser?.state_of_origin || 'N/A',
    lga: displayUser?.lga || 'N/A'
  };

  // Initialize form data from student prop
  useEffect(() => {
    if (student) {
      setFormData({
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        parentName: student.parent_name || '',
        parentPhone: student.parent_phone || '',
        parentEmail: student.parent_email || ''
      });
    }
  }, [student]);

  // Get subjects from user data
  const subjects = displayUser?.student_subjects?.map(ss => ss.subject?.name).filter(Boolean) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError('New password must be at least 8 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      await API.changeStudentPassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      showSuccess('Password changed successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.updateStudentProfile({
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        parent_phone: formData.parentPhone,
        parent_email: formData.parentEmail
      });
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset form data to original values from student prop
    if (student) {
      setFormData({
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        parentName: student.parent_name || '',
        parentPhone: student.parent_phone || '',
        parentEmail: student.parent_email || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary.red }}></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: COLORS.primary.red }}>
                {displayUser?.first_name?.[0]}{displayUser?.last_name?.[0]}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {displayUser?.first_name} {displayUser?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{studentInfo.admissionNumber}</p>
              <p className="text-sm font-medium text-indigo-600">{studentInfo.class}</p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                  <dd className="text-sm text-gray-900">{studentInfo.studentId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Session</dt>
                  <dd className="text-sm text-gray-900">{studentInfo.session}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Admitted</dt>
                  <dd className="text-sm text-gray-900">{new Date(studentInfo.dateAdmitted).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                  <dd className="text-sm text-gray-900">{studentInfo.bloodGroup}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Genotype</dt>
                  <dd className="text-sm text-gray-900">{studentInfo.genotype}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Change Password</h4>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.primary.red }}
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {showPasswordForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary.red }}
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary.red }}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: COLORS.primary.red }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Basic Information (Read Only)</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{displayUser?.first_name || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{displayUser?.last_name || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <p className="mt-1 text-sm text-gray-900">{displayUser?.middle_name || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Number</label>
                    <p className="mt-1 text-sm text-gray-900">{displayUser?.admission_number || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {displayUser?.date_of_birth ? new Date(displayUser.date_of_birth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{displayUser?.gender || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.email || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.phone || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.address || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Parent/Guardian Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Parent/Guardian Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.parentName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.parentPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.parentEmail}</p>
                    )}
                  </div>



                  {/* Subjects Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Offered</label>
                    <div className="grid grid-cols-1 gap-2">
                      {subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default StudentProfile;
