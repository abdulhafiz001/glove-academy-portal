import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { COLORS } from '../../constants/colors';
import AppLayout from '../../layouts/AppLayout';

const StudentDashboard = ({ student, stats, recent_scores, academic_session }) => {
  const { props } = usePage();
  const user = props.auth?.user || student;

  // Get form teacher name from dashboard data or user object
  const getFormTeacherName = () => {
    // Try from student data first (most up-to-date)
    if (student?.school_class?.form_teacher) {
      const formTeacher = student.school_class.form_teacher;
      if (formTeacher.name) {
        return formTeacher.name;
      }
      if (formTeacher.first_name && formTeacher.last_name) {
        return `${formTeacher.first_name} ${formTeacher.last_name}`;
      }
    }
    // Fallback to user object
    if (user?.school_class?.form_teacher) {
      const formTeacher = user.school_class.form_teacher;
      if (formTeacher.name) {
        return formTeacher.name;
      }
      if (formTeacher.first_name && formTeacher.last_name) {
        return `${formTeacher.first_name} ${formTeacher.last_name}`;
      }
    }
    return 'Not Assigned';
  };

  const getClassName = () => {
    return student?.school_class?.name || user?.school_class?.name || 'Not Assigned';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Here's your academic overview for {getClassName()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.total_subjects || 0}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.primary.blue}20` }}>
                <svg className="w-8 h-8" style={{ color: COLORS.primary.blue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.completed_subjects || 0}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.primary.red}20` }}>
                <svg className="w-8 h-8" style={{ color: COLORS.primary.red }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Form Teacher</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {getFormTeacherName()}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.primary.yellow}20` }}>
                <svg className="w-8 h-8" style={{ color: COLORS.primary.yellow }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scores */}
        {recent_scores && recent_scores.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Scores</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recent_scores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{score.subject?.name || 'Unknown Subject'}</p>
                      <p className="text-sm text-gray-600">{score.school_class?.name || 'Unknown Class'}</p>
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
              <div className="mt-6">
                <Link
                  href="/student/results"
                  className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: COLORS.primary.red }}
                >
                  View All Results
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/student/results"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.blue}20` }}>
                <svg className="w-8 h-8" style={{ color: COLORS.primary.blue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Results</h3>
                <p className="text-sm text-gray-600">Check your academic performance</p>
              </div>
            </div>
          </Link>

          <Link
            href="/student/subjects"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary.yellow}20` }}>
                <svg className="w-8 h-8" style={{ color: COLORS.primary.yellow }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Subjects</h3>
                <p className="text-sm text-gray-600">View all your subjects</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
