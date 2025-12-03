import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import API from '../../services/API';
import { useNotification } from '../../contexts/NotificationContext';
import { COLORS } from '../../constants/colors';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  School, 
  BookOpen, 
  Save,
  RefreshCw
} from 'lucide-react';
import debug from '../../utils/debug';

const Attendance = () => {
    const { showSuccess, showError } = useNotification();
    
    // --- STATE MANAGEMENT ---
    const [loading, setLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState(null);
    const [currentTerm, setCurrentTerm] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    
    // Time States
    const [week, setWeek] = useState(1);
    const [day, setDay] = useState('Monday');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Attendance Data
    const [attendanceStatus, setAttendanceStatus] = useState({}); 
    const [remarks, setRemarks] = useState({});
    const [submitting, setSubmitting] = useState(false);
    
    // CACHE STATE: Holds the raw data for the current selected Week
    const [weekRecords, setWeekRecords] = useState([]); 
    const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
    const [fetchingRecords, setFetchingRecords] = useState(false);

    // --- REFS ---
    // Used to prevent race conditions during async calls
    const filterRef = useRef({
        classId: null,
        subjectId: null,
        week: null,
        sessionId: null,
        term: null
    });
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // --- HELPERS ---
    const normalizeDate = useCallback((dateStr) => {
        if (!dateStr) return null;
        if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        if (dateStr instanceof Date) return dateStr.toISOString().split('T')[0];
        if (typeof dateStr === 'string') return dateStr.split('T')[0];
        return dateStr;
    }, []);

    // --- CALCULATED STATS ---
    const stats = useMemo(() => {
        const total = students.length;
        const present = Object.values(attendanceStatus).filter(s => s === 'present').length;
        const absent = Object.values(attendanceStatus).filter(s => s === 'absent').length;
        const late = Object.values(attendanceStatus).filter(s => s === 'late').length;
        
        const percent = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
        return { total, present, absent, late, percent };
    }, [attendanceStatus, students.length]);

    // --- INITIAL LOAD ---
    useEffect(() => {
        fetchCurrentSession();
        fetchClasses();
    }, []);

    // --- 1. FETCH LOGIC (Runs only when Class, Subject, or Week changes) ---
    useEffect(() => {
        if (selectedClass?.id && selectedSubject?.id && currentSession?.id && week) {
            fetchWeekRecords();
        } else {
            setWeekRecords([]);
        }
    }, [selectedClass?.id, selectedSubject?.id, week, currentSession?.id, currentTerm?.name]);

    // --- 2. STUDENT FETCH LOGIC ---
    useEffect(() => {
        if (selectedClass?.id && selectedSubject?.id) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClass?.id, selectedSubject?.id]);

    // --- 3. UI SYNC LOGIC (The "Instant" Part) ---
    // This runs immediately when Day/Date changes OR when new Week Records arrive OR when Students load.
    useEffect(() => {
        if (students.length === 0) return;

        const normalizedCurrentDate = normalizeDate(date);
        const normalizedCurrentDay = day.trim();
        const normalizedWeek = Number(week);

        let markedForToday = false;
        const statusMap = {};
        const remarksMap = {};

        // 1. Process the "Cached" Week Records to find a match for TODAY
        if (weekRecords.length > 0) {
            for (const record of weekRecords) {
                if (!record.records || !Array.isArray(record.records)) continue;

                const studentId = record.student_id;
                
                // Find the specific record entry for this Day/Date
                const match = record.records.find(r => {
                    const rDate = normalizeDate(r.date);
                    const rWeek = Number(r.week);
                    const rDay = String(r.day).trim();
                    
                    // Match Logic: Check Week AND (Day OR Date)
                    // We check date strictly if provided, otherwise trust the day string
                    return rWeek === normalizedWeek && 
                           (rDate === normalizedCurrentDate && rDay === normalizedCurrentDay);
                });

                if (match) {
                    markedForToday = true;
                    statusMap[studentId] = match.status || 'present';
                    if (match.remark) remarksMap[studentId] = match.remark;
                }
            }
        }

        // 2. Update UI State Instantly
        setIsAttendanceMarked(markedForToday);

        const finalStatus = {};
        const finalRemarks = {};

        students.forEach(student => {
            // If we found data for today, use it. Otherwise, default to Present.
            if (markedForToday && statusMap[student.id]) {
                finalStatus[student.id] = statusMap[student.id];
                finalRemarks[student.id] = remarksMap[student.id] || '';
            } else {
                finalStatus[student.id] = 'present';
                finalRemarks[student.id] = '';
            }
        });

        setAttendanceStatus(finalStatus);
        setRemarks(finalRemarks);

    }, [weekRecords, day, date, students, week, normalizeDate]); 
    // ^ Depend only on local data. Changing 'day' triggers this effect, not a network call.


    // --- API FUNCTIONS ---

    const fetchCurrentSession = async () => {
        try {
            const response = await API.getCurrentAcademicSession();
            // Handle various response structures
            const data = response?.data || response;
            const session = data?.session || data?.academic_session || response?.session;
            const term = data?.term || response?.term;
            
            if (session) setCurrentSession(session);
            if (term) setCurrentTerm(term);
        } catch (error) {
            console.error(error);
            showError('Failed to load session info');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await API.getTeacherAttendanceClasses();
            const data = Array.isArray(response) ? response : (response?.data?.data || response?.data || []);
            setClasses(data);
        } catch (error) { console.error(error); }
    };

    const fetchStudents = async () => {
        try {
            const response = await API.getClassStudentsForAttendance(selectedClass.id, selectedSubject.id);
            const data = Array.isArray(response) ? response : (response?.data?.data || response?.data || []);
            setStudents(data);
        } catch (error) { showError('Error loading students'); }
    };

    const fetchWeekRecords = async () => {
        // Prevent unnecessary calls
        if (!selectedClass?.id || !selectedSubject?.id || !week || !currentSession?.id) return;
        
        setFetchingRecords(true);
        try {
            const params = {
                class_id: selectedClass.id,
                subject_id: selectedSubject.id,
                week: week, // Fetch the WHOLE week
                academic_session_id: currentSession.id,
                term: currentTerm?.name,
            };
            
            const response = await API.getAttendanceRecords(params);
            // Handle different response structures
            let records = [];
            if (Array.isArray(response)) {
                records = response;
            } else if (response?.data) {
                records = Array.isArray(response.data) ? response.data : [];
            } else if (response?.data?.data) {
                records = Array.isArray(response.data.data) ? response.data.data : [];
            }
            
            setWeekRecords(records); // Store in "Cache"
        } catch (error) {
            console.error('Fetch error:', error);
            // Don't clear records on error, might just be network blip
            const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh records';
            showError(errorMessage);
        } finally {
            setFetchingRecords(false);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!selectedClass?.id || !selectedSubject?.id || !date) {
            showError('Please check all fields.');
            return;
        }

        setSubmitting(true);
        try {
            const attendances = students.map(student => ({
                student_id: student.id,
                status: attendanceStatus[student.id] || 'present',
                remark: remarks[student.id] || null,
            }));

            const payload = {
                class_id: selectedClass.id,
                subject_id: selectedSubject.id,
                week: week,
                day: day,
                date: date,
                attendances: attendances,
            };

            await API.markAttendance(payload);
            showSuccess(`Attendance marked for ${day}`);
            
            // Refresh the "Cache" (Week Records) so the UI updates to "Marked" immediately
            await fetchWeekRecords();
            
        } catch (error) {
            showError(error.message || 'Error saving attendance');
        } finally {
            setSubmitting(false);
        }
    }, [selectedClass, selectedSubject, week, day, date, students, attendanceStatus, remarks]);

    // --- UI RENDER HELPERS ---
    const getStatusColor = (status) => {
        switch(status) {
            case 'present': return 'bg-green-50 text-green-700 border-green-200';
            case 'absent': return 'bg-red-50 text-red-700 border-red-200';
            case 'late': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'excused': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: COLORS.primary.red }}></div>
                    <p className="text-gray-500 font-medium">Loading portal...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!currentSession || !currentTerm) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center border-t-4" style={{ borderColor: COLORS.primary.red }}>
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Not Configured</h2>
                        <p className="text-gray-600 mb-6">Contact admin to set active session.</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Class Attendance</h1>
                        <p className="text-gray-500 mt-1">Manage and track student presence</p>
                    </div>
                    
                    <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="bg-red-50 p-2 rounded-full">
                            <Calendar className="h-5 w-5" style={{ color: COLORS.primary.red }} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Session</p>
                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                <span>{currentSession.name}</span>
                                <span className="text-gray-300">•</span>
                                <span>{currentTerm.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <School className="h-5 w-5 text-gray-500" />
                            Configuration
                        </h2>
                        {fetchingRecords && (
                             <span className="text-xs text-blue-600 flex items-center gap-1 animate-pulse">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Syncing Week...
                             </span>
                        )}
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                        {/* Class Selection */}
                        <div className="lg:col-span-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
                                <select
                                    value={selectedClass?.id || ''}
                                    onChange={(e) => {
                                        const cls = classes.find(c => c.id === parseInt(e.target.value));
                                        setSelectedClass(cls);
                                        setSelectedSubject(null);
                                    }}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                <select
                                    value={selectedSubject?.id || ''}
                                    onChange={(e) => setSelectedSubject(selectedClass?.subjects?.find(s => s.id === parseInt(e.target.value)))}
                                    disabled={!selectedClass}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white disabled:bg-gray-50"
                                >
                                    <option value="">Select Subject</option>
                                    {selectedClass?.subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="hidden lg:block lg:col-span-1 border-l border-gray-200 mx-auto h-full"></div>

                        {/* Date/Time Selection */}
                        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Week</label>
                                <select 
                                    value={week} 
                                    onChange={(e) => setWeek(parseInt(e.target.value))}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                >
                                    {Array.from({ length: 14 }, (_, i) => i + 1).map(w => (
                                        <option key={w} value={w}>Week {w}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Day</label>
                                <select 
                                    value={day} 
                                    onChange={(e) => setDay(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                >
                                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                                <input 
                                    type="date" 
                                    value={date} 
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table Area */}
                {students.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Live Summary Bar */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4 sticky top-0 z-10 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    Students ({students.length})
                                </h3>
                                
                                {isAttendanceMarked ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 animate-in fade-in duration-300">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Marked
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                        Not Marked
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-md font-medium border border-green-200">
                                    P: {stats.present}
                                </div>
                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-md font-medium border border-red-200">
                                    A: {stats.absent}
                                </div>
                                <div className="hidden sm:block px-3 py-1 bg-gray-100 text-gray-600 rounded-md font-medium border border-gray-200">
                                    {stats.percent}%
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                        <th className="px-6 py-4 font-semibold w-16">#</th>
                                        <th className="px-6 py-4 font-semibold">Student Info</th>
                                        <th className="px-6 py-4 font-semibold w-48">Status</th>
                                        <th className="px-6 py-4 font-semibold">Remark</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student, index) => {
                                        const currentStatus = attendanceStatus[student.id] || 'present';
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {student.last_name}, {student.first_name} {student.middle_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {student.admission_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={currentStatus}
                                                        onChange={(e) => setAttendanceStatus(prev => ({ ...prev, [student.id]: e.target.value }))}
                                                        disabled={isAttendanceMarked}
                                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium border focus:ring-2 focus:ring-offset-1 transition-all outline-none appearance-none text-center ${getStatusColor(currentStatus)} ${isAttendanceMarked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <option value="present">Present</option>
                                                        <option value="absent">Absent</option>
                                                        <option value="late">Late</option>
                                                        <option value="excused">Excused</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={remarks[student.id] || ''}
                                                        onChange={(e) => setRemarks(prev => ({ ...prev, [student.id]: e.target.value }))}
                                                        disabled={isAttendanceMarked}
                                                        placeholder={isAttendanceMarked ? "-" : "Add note..."}
                                                        className="w-full bg-transparent border-b border-gray-200 py-1 text-sm focus:border-red-500 focus:outline-none placeholder-gray-300"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || students.length === 0 || isAttendanceMarked}
                                className={`
                                    flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all
                                    ${isAttendanceMarked 
                                        ? 'bg-green-600 cursor-not-allowed opacity-90' 
                                        : 'bg-red-600 hover:bg-red-700 hover:shadow-lg active:transform active:scale-95'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                                style={{ backgroundColor: isAttendanceMarked ? undefined : COLORS.primary.red }}
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : isAttendanceMarked ? (
                                    <>
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Attendance Marked</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Submit Attendance</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Select Class</h3>
                        <p className="text-gray-500">Choose a class and subject to view students.</p>
                    </div>
                )}
            </div>
        </div>
    </AdminLayout>
    );
};

export default Attendance;