import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  BookOpen, 
  GraduationCap,
  Users,
  UserCheck,
  Edit,
  FileText
} from 'lucide-react';
import { COLORS } from '../../constants/colors';
import API from '../../services/API';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../layouts/AdminLayout';

const StudentDetails = ({ student: initialStudent }) => {
  // Student data is passed from Laravel controller as a prop
  const { showError } = useNotification();
  const { user } = useAuth();
  const [student, setStudent] = useState(initialStudent || null);
  const [loading, setLoading] = useState(!initialStudent);

  useEffect(() => {
    // If student data is passed as prop, use it directly
    if (initialStudent) {
      setStudent(initialStudent);
      setLoading(false);
    }
  }, [initialStudent]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary.red }}></div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Student not found</h3>
          <p className="mt-1 text-sm text-gray-500">The student you're looking for doesn't exist.</p>
        </div>
      </AdminLayout>
    );
  }

  const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim();
  const age = student.date_of_birth 
    ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()
    : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.visit('/admin/students')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
            <p className="text-sm text-gray-500 mt-1">View comprehensive student information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (user?.role === 'admin') {
                router.visit(`/admin/students/${student.id}/results`);
              } else if (user?.role === 'teacher') {
                router.visit(`/teacher/student-results/${student.id}`);
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Results
          </button>
          {(user?.role === 'admin' || (user?.role === 'teacher' && user?.is_form_teacher)) && (
            <button
              onClick={() => {
                // Navigate to edit student page or open edit modal
                router.visit(`/admin/students?edit=${student.id}`);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:shadow-lg transition-all"
              style={{ backgroundColor: COLORS.primary.red }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Student
            </button>
          )}
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="h-32 bg-gradient-to-r"
          style={{ 
            background: `linear-gradient(to right, ${COLORS.primary.red}, ${COLORS.primary.blue})` 
          }}
        />
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                {student.avatar ? (
                  <img 
                    src={student.avatar} 
                    alt={fullName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="pb-2">
                <h3 className="text-2xl font-bold text-gray-900">{fullName}</h3>
                <p className="text-sm text-gray-600 mt-1">{student.admission_number}</p>
                {student.school_class && (
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2"
                    style={{ 
                      backgroundColor: `${COLORS.primary.red}20`,
                      color: COLORS.primary.red
                    }}
                  >
                    <GraduationCap className="mr-1 h-4 w-4" />
                    {student.school_class.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" style={{ color: COLORS.primary.red }} />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Full Name:</div>
              <div className="text-sm text-gray-900">{fullName}</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Admission Number:</div>
              <div className="text-sm text-gray-900 font-mono">{student.admission_number}</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Gender:</div>
              <div className="text-sm text-gray-900 capitalize">{student.gender || 'Not specified'}</div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Date of Birth:</div>
              <div className="text-sm text-gray-900">
                {student.date_of_birth 
                  ? new Date(student.date_of_birth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'Not specified'
                }
                {age && ` (${age} years old)`}
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Email:</div>
              <div className="text-sm text-gray-900 flex items-center">
                <Mail className="mr-1 h-4 w-4 text-gray-400" />
                {student.email || 'Not provided'}
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Phone:</div>
              <div className="text-sm text-gray-900 flex items-center">
                <Phone className="mr-1 h-4 w-4 text-gray-400" />
                {student.phone || 'Not provided'}
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Address:</div>
              <div className="text-sm text-gray-900 flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                {student.address || 'Not provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" style={{ color: COLORS.primary.blue }} />
            Academic Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Class:</div>
              <div className="text-sm text-gray-900">
                {student.school_class?.name || 'Not assigned'}
              </div>
            </div>
            {student.school_class?.form_teacher && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Form Teacher:</div>
                <div className="text-sm text-gray-900 flex items-center">
                  <UserCheck className="mr-1 h-4 w-4 text-gray-400" />
                  {student.school_class.form_teacher.name}
                </div>
              </div>
            )}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Status:</div>
              <div className="text-sm">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" style={{ color: COLORS.primary.red }} />
          Subjects ({student.student_subjects?.length || 0})
        </h3>
        {student.student_subjects && student.student_subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {student.student_subjects.map((studentSubject) => (
              <div
                key={studentSubject.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" style={{ color: COLORS.primary.blue }} />
                  <span className="text-sm font-medium text-gray-900">
                    {studentSubject.subject?.name || 'Unknown Subject'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No subjects assigned</p>
          </div>
        )}
      </div>

      {/* Parent/Guardian Information */}
      {(student.parent_name || student.parent_phone || student.parent_email) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" style={{ color: COLORS.primary.blue }} />
            Parent/Guardian Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {student.parent_name && (
              <div>
                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-sm text-gray-900 mt-1">{student.parent_name}</div>
              </div>
            )}
            {student.parent_phone && (
              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                <div className="text-sm text-gray-900 mt-1 flex items-center">
                  <Phone className="mr-1 h-4 w-4 text-gray-400" />
                  {student.parent_phone}
                </div>
              </div>
            )}
            {student.parent_email && (
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="mr-1 h-4 w-4 text-gray-400" />
                  {student.parent_email}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default StudentDetails;

