import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
import { COLORS } from '../constants/colors';
import API from '../services/API';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const EditStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const { showError, showSuccess } = useNotification();
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      // Ensure formData is properly initialized
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        middle_name: student.middle_name || '',
        admission_number: student.admission_number || '',
        email: student.email || '',
        phone: student.phone || '',
        date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
        gender: student.gender || '',
        address: student.address || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        parent_email: student.parent_email || '',
        class_id: student.class_id?.toString() || '',
        subjects: student.student_subjects?.map(sub => sub.subject?.name) || [], // Store subject names as expected by backend
        is_active: student.is_active !== undefined ? student.is_active : true,
      });
      
      // Reset subjects and classes to prevent stale data
      setSubjects([]);
      setClasses([]);
      
      fetchClasses();
      fetchSubjects();
    } else if (!isOpen) {
      // Reset state when modal closes
      setFormData({});
      setSubjects([]);
      setClasses([]);
      setSubjectsLoading(false);
    }
  }, [isOpen, student]);

  const fetchClasses = async () => {
    try {
      let response;
      if (user?.role === 'teacher') {
        // Teachers can only see their assigned classes
        response = await API.getTeacherClasses();
      } else {
        // Admins can see all classes
        response = await API.getClasses();
      }
      
      // Handle different response structures
      let classesData = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          // Direct array response (from TeacherController)
          classesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Standard backend response structure (from ClassController)
          classesData = response.data.data;
        }
      }
      
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      let response;
      
      // Both teachers and admins should see ALL subjects for managing student enrollments
      // Form teachers need to see all subjects to manage which ones their students are enrolled in
      if (user?.role === 'teacher') {
        // Teachers use the getAllSubjects endpoint to see all subjects
        response = await API.getAllSubjects();
      } else {
        // Admins use the admin subjects endpoint
        response = await API.getSubjects();
      }
      
      // Handle different response structures
      let subjectsData = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          // Direct array response (from SubjectController and TeacherController)
          subjectsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Standard backend response structure (if any)
          subjectsData = response.data.data;
        }
      }
      
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubjectChange = (subjectName) => {
    setFormData(prev => ({
      ...prev,
      subjects: (prev.subjects || []).includes(subjectName)
        ? (prev.subjects || []).filter(sub => sub !== subjectName)
        : [...(prev.subjects || []), subjectName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      if (user?.role === 'teacher') {
        response = await API.updateTeacherStudent(student.id, formData);
      } else {
        // Admin should use admin endpoint
        response = await API.updateStudent(student.id, formData);
      }

      showSuccess('Student updated successfully');
      onSuccess(response.data.student);
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update student');
      console.error('Error updating student:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-xl rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Student</h3>
            <p className="text-sm text-gray-600 mt-1">
              Update student information and academic details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-3 h-5 w-5 text-blue-600" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                        <input
          type="text"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter first name"
        />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                        <input
          type="text"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter last name"
        />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                        <input
          type="text"
          name="middle_name"
          value={formData.middle_name || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter middle name"
        />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Number *
                </label>
                <input
                  type="text"
                  name="admission_number"
                  value={formData.admission_number || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., ADM/2024/001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="mr-3 h-5 w-5 text-green-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="student@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-3 h-5 w-5 text-purple-600" />
              Parent/Guardian Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter parent/guardian name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  name="parent_phone"
                  value={formData.parent_phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Email
              </label>
              <input
                type="email"
                name="parent_email"
                value={formData.parent_email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="parent@email.com"
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="mr-3 h-5 w-5 text-yellow-600" />
              Academic Information
            </h4>
            
            {/* Role-based access message */}
            {user?.role === 'teacher' && classes.length === 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Limited Access
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You can only edit students from classes where you are the form teacher.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                  {user?.role === 'teacher' && (
                    <span className="text-xs text-blue-600 ml-2">(Your assigned classes only)</span>
                  )}
                </label>
                <select
                  name="class_id"
                  value={formData.class_id || ''}
                  onChange={handleInputChange}
                  required
                  disabled={loading || (user?.role === 'teacher' && classes.length === 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">
                    {loading
                      ? 'Loading classes...'
                      : classes.length === 0
                        ? 'No classes available'
                        : 'Select Class'
                    }
                  </option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="is_active"
                  value={formData.is_active?.toString() || 'true'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            {/* Subjects Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Subjects
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subjectsLoading ? (
                  <div className="col-span-full text-center py-4 text-gray-500">Loading subjects...</div>
                ) : !subjects || subjects.length === 0 ? (
                  <div className="col-span-full text-center py-4 text-gray-500">No subjects available</div>
                ) : (
                  subjects.map((subject, index) => (
                    <label key={`${subject.id}-${index}`} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subjects?.includes(subject.name) || false}
                        onChange={() => handleSubjectChange(subject.name)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-yellow-500 text-yellow-600"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{subject.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              style={{ backgroundColor: COLORS.primary.red }}
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Changes...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
