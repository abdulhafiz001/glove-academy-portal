import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { COLORS } from '../../constants/colors';
import AdminLayout from '../../layouts/AdminLayout';
import TeacherDashboard from '../teacher/TeacherDashboard';
import AcademicSessionWarningModal from '../../components/AcademicSessionWarningModal';

const Dashboard = ({ stats, recent_students, academic_session }) => {
  const { props } = usePage();
  const user = props.auth?.user;

  // Route to appropriate dashboard based on user role
  if (user?.role === 'teacher') {
    return <TeacherDashboard />;
  }

  // Default to admin dashboard
  return <AdminDashboardContent stats={stats} recent_students={recent_students} academic_session={academic_session} />;
};

const AdminDashboardContent = ({ stats, recent_students, academic_session }) => {
  const statsList = [
    {
      name: 'Total Students',
      value: stats?.total_students || '0',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: COLORS.primary.blue
    },
    {
      name: 'Active Classes',
      value: stats?.total_classes || '0',
      change: '+2',
      changeType: 'increase',
      icon: BookOpen,
      color: COLORS.primary.yellow
    },
    {
      name: 'Total Subjects',
      value: stats?.total_subjects || '0',
      change: '+8%',
      changeType: 'increase',
      icon: FileText,
      color: COLORS.primary.red
    },
    {
      name: 'Total Teachers',
      value: stats?.total_teachers || '0',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: COLORS.primary.blue
    },
  ];

  const hasSession = academic_session?.has_session || false;
  const hasTerm = academic_session?.has_term || false;
  const currentSession = academic_session?.session;
  const currentTerm = academic_session?.term;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Academic Session Warning */}
        {(!hasSession || !hasTerm) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {!hasSession && 'No active academic session set. '}
                  {!hasTerm && 'No active term set. '}
                  Please configure these in Settings.
                </p>
              </div>
            </div>
          </div>
        )}

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
                    <p className={`text-sm mt-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon className="w-8 h-8" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Students */}
        {recent_students && recent_students.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Students</h2>
              <Link
                href="/admin/students"
                className="text-sm font-medium"
                style={{ color: COLORS.primary.red }}
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recent_students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.admission_number} • {student.school_class?.name || 'No Class'}
                      </p>
                    </div>
                    <Link
                      href={`/admin/students/${student.id}/details`}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: COLORS.primary.red }}
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/students"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.blue}20` }}>
                <Users className="w-8 h-8" style={{ color: COLORS.primary.blue }} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
                <p className="text-sm text-gray-600">View and manage all students</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/manage-scores"
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
            href="/admin/settings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.yellow}20` }}>
                <Calendar className="w-8 h-8" style={{ color: COLORS.primary.yellow }} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Configure academic sessions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
