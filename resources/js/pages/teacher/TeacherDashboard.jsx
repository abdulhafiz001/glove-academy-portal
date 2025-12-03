import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
  UserCheck,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react';
import { COLORS } from '../../constants/colors';
import AdminLayout from '../../layouts/AdminLayout';

const TeacherDashboard = ({ teacher, stats, assignments, recent_scores, form_teacher_classes }) => {
  const { props } = usePage();
  const user = props.auth?.user || teacher;

  const statsList = [
    {
      name: 'Form Teacher Classes',
      value: form_teacher_classes?.length || '0',
      change: 'Active',
      changeType: 'neutral',
      icon: GraduationCap,
      color: COLORS.primary.red,
      description: 'Classes you manage'
    },
    {
      name: 'Teaching Assignments',
      value: stats?.total_classes || '0',
      change: 'Active',
      changeType: 'neutral',
      icon: BookOpen,
      color: COLORS.primary.blue,
      description: 'Subject assignments'
    },
    {
      name: 'Total Students',
      value: stats?.total_students || '0',
      change: 'Enrolled',
      changeType: 'neutral',
      icon: Users,
      color: COLORS.primary.yellow,
      description: 'Across all classes'
    },
    {
      name: 'Recent Scores',
      value: recent_scores?.length || '0',
      change: 'Entered',
      changeType: 'neutral',
      icon: FileText,
      color: COLORS.primary.blue,
      description: 'Latest entries'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Teacher'}!
          </h1>
          <p className="text-gray-600">
            Here's your teaching overview and recent activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon className="w-8 h-8" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Teacher Classes */}
        {form_teacher_classes && form_teacher_classes.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Form Teacher Classes</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {form_teacher_classes.map((classItem) => (
                  <Link
                    key={classItem.id}
                    href={`/admin/classes`}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{classItem.name}</p>
                        <p className="text-sm text-gray-600">
                          {classItem.students?.length || 0} students
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Scores */}
        {recent_scores && recent_scores.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Scores</h2>
              <Link
                href="/teacher/manage-scores"
                className="text-sm font-medium"
                style={{ color: COLORS.primary.red }}
              >
                Manage Scores
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recent_scores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {score.student?.first_name} {score.student?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {score.subject?.name} • {score.school_class?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: COLORS.primary.red }}>
                        {score.total_score || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">{score.term || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/teacher/manage-scores"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.red}20` }}>
                <FileText className="w-8 h-8" style={{ color: COLORS.primary.red }} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Scores</h3>
                <p className="text-sm text-gray-600">Enter and update student scores</p>
              </div>
            </div>
          </Link>

          <Link
            href="/teacher/attendance"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.blue}20` }}>
                <Calendar className="w-8 h-8" style={{ color: COLORS.primary.blue }} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
                <p className="text-sm text-gray-600">Record student attendance</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/students"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.yellow}20` }}>
                <Users className="w-8 h-8" style={{ color: COLORS.primary.yellow }} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Students</h3>
                <p className="text-sm text-gray-600">Browse your students</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeacherDashboard;
