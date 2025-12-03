<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradingConfigurationController;

// Home page (guest)
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Default login route used by Laravel when redirecting guests
Route::get('/login', function () {
    // Send guests to the landing page where they can choose the correct portal
    return redirect()->route('home');
})->name('login');

// Auth routes (guest only)
Route::middleware('guest')->group(function () {
    Route::get('/auth/admin/login', function () {
        return Inertia::render('auth/AdminLogin');
    })->name('admin.login');
    
    Route::get('/auth/student/login', function () {
        return Inertia::render('auth/StudentLogin');
    })->name('student.login');
    
    Route::get('/student/forgot-password', function () {
        return Inertia::render('auth/ForgotPassword');
    })->name('student.forgot-password');
    
    // Login handlers
    Route::post('/auth/admin/login', [AuthController::class, 'login']);
    Route::post('/auth/student/login', [AuthController::class, 'studentLogin']);
    Route::post('/student/forgot-password/verify', [AuthController::class, 'verifyStudentIdentity']);
    Route::post('/student/forgot-password/reset', [AuthController::class, 'resetStudentPassword']);
});

// Protected routes - Student
// Use 'student' guard for authentication, then check with 'student' middleware
Route::middleware(['auth:student', 'student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/results', [StudentController::class, 'getResults'])->name('results');
    Route::get('/results/api', [StudentController::class, 'getResultsApi'])->name('results.api'); // API endpoint for JSON
    Route::get('/progress', [StudentController::class, 'getProgress'])->name('progress');
    Route::get('/subjects', [StudentController::class, 'getSubjects'])->name('subjects');
    Route::get('/analysis', function () {
        return Inertia::render('student/StudentAnalysis');
    })->name('analysis');
    Route::get('/profile', [StudentController::class, 'getProfile'])->name('profile');
    Route::put('/profile', [StudentController::class, 'updateProfile']);
    Route::put('/change-password', [StudentController::class, 'changePassword']);
    Route::get('/report-card', [ReportController::class, 'generateStudentReport'])->name('report-card');
});

// Protected routes - Admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/students', [AdminController::class, 'getStudents'])->name('students');
    Route::post('/students', [AdminController::class, 'createStudent']);
    Route::get('/students/{student}/details', [AdminController::class, 'getStudent'])->name('students.details');
    Route::get('/students/{student}/results', [ScoreController::class, 'adminStudentResults'])->name('students.results');
    Route::get('/add-student', function () {
        $user = auth()->user();
        $classes = [];
        $subjects = [];
        
        // Get classes based on user role
        if ($user->isAdmin()) {
            $classes = \App\Models\SchoolClass::where('is_active', true)->get();
        } elseif ($user->isFormTeacher()) {
            $classes = \App\Models\SchoolClass::where('form_teacher_id', $user->id)
                ->where('is_active', true)
                ->get();
        }
        
        // Get subjects
        $subjects = \App\Helpers\CacheHelper::getSubjects(function () {
            return \App\Models\Subject::where('is_active', true)->get();
        });
        
        return Inertia::render('admin/AddStudent', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    })->name('add-student');
    Route::get('/manage-scores', function () {
        return Inertia::render('admin/ManageScores');
    })->name('manage-scores');
    Route::get('/classes', [ClassController::class, 'index'])->name('classes');
    Route::get('/results', [ScoreController::class, 'adminIndex'])->name('results');
    Route::get('/attendance-analysis', function () {
        return Inertia::render('admin/AttendanceAnalysis');
    })->name('attendance-analysis');
    Route::get('/settings', function () {
        return Inertia::render('admin/Settings');
    })->name('settings');
    Route::get('/profile', [AdminController::class, 'getProfile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::put('/change-password', [AdminController::class, 'changePassword']);
    
    // API Routes for Admin
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::get('/teacher-activities', [AdminController::class, 'getTeacherActivities']);
    Route::get('/teacher-assignments', [AdminController::class, 'getTeacherAssignments']);
    Route::post('/teacher-assignments', [AdminController::class, 'assignTeacher']);
    Route::delete('/teacher-assignments/{assignment}', [AdminController::class, 'removeTeacherAssignment']);
    
    // Subjects API Routes
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::get('/subjects/{subject}', [SubjectController::class, 'show']);
    Route::put('/subjects/{subject}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);
    
    // Classes API Routes (index handles both JSON and Inertia)
    Route::post('/classes', [ClassController::class, 'store']);
    Route::get('/classes/{class}', [ClassController::class, 'show']);
    Route::put('/classes/{class}', [ClassController::class, 'update']);
    Route::delete('/classes/{class}', [ClassController::class, 'destroy']);
    
    // Grading Configurations API Routes
    Route::get('/grading-configurations', [GradingConfigurationController::class, 'index']);
    Route::post('/grading-configurations', [GradingConfigurationController::class, 'store']);
    Route::get('/grading-configurations/{gradingConfiguration}', [GradingConfigurationController::class, 'show']);
    Route::put('/grading-configurations/{gradingConfiguration}', [GradingConfigurationController::class, 'update']);
    Route::delete('/grading-configurations/{gradingConfiguration}', [GradingConfigurationController::class, 'destroy']);
    Route::post('/grading-configurations/{gradingConfiguration}/set-default', [GradingConfigurationController::class, 'setDefault']);
    
    // Attendance API Routes
    Route::get('/attendance/statistics', [AttendanceController::class, 'getAttendanceStatistics']);
    
    // Academic Sessions API Routes
    Route::get('/academic-sessions', [AcademicSessionController::class, 'index']);
    Route::post('/academic-sessions', [AcademicSessionController::class, 'store']);
    Route::get('/academic-sessions/{academicSession}', [AcademicSessionController::class, 'show']);
    Route::put('/academic-sessions/{academicSession}', [AcademicSessionController::class, 'update']);
    Route::delete('/academic-sessions/{academicSession}', [AcademicSessionController::class, 'destroy']);
    Route::post('/academic-sessions/{academicSession}/set-current', [AcademicSessionController::class, 'setCurrent']);
});

// Protected routes - Teacher
Route::middleware(['auth:sanctum', 'teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::get('/students', [TeacherController::class, 'getStudents'])->name('students');
    Route::post('/students', [TeacherController::class, 'addStudent']);
    Route::get('/add-student', function () {
        $user = auth()->user();
        $classes = [];
        $subjects = [];
        
        // Get classes based on user role (form teachers only)
        if ($user->isFormTeacher()) {
            $classes = \App\Models\SchoolClass::where('form_teacher_id', $user->id)
                ->where('is_active', true)
                ->get();
        }
        
        // Get subjects
        $subjects = \App\Helpers\CacheHelper::getSubjects(function () {
            return \App\Models\Subject::where('is_active', true)->get();
        });
        
        return Inertia::render('admin/AddStudent', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    })->name('add-student');
    Route::get('/manage-scores', function () {
        $user = auth()->user();
        
        // Get current academic session and term
        $currentSession = \App\Models\AcademicSession::current();
        $currentTerm = \App\Models\Term::current();
        
        // Get teacher assignments for scores
        $teacherAssignments = \App\Models\TeacherSubject::with(['schoolClass', 'subject'])
            ->where('teacher_id', $user->id)
            ->where('is_active', true)
            ->get()
            ->groupBy('class_id')
            ->map(function ($classAssignments) {
                $class = $classAssignments->first()->schoolClass;
                // Ensure subjects are properly formatted as an array with id and name
                $subjects = $classAssignments->map(function ($assignment) {
                    if ($assignment->subject) {
                        return [
                            'id' => $assignment->subject->id,
                            'name' => $assignment->subject->name,
                            'code' => $assignment->subject->code ?? null,
                        ];
                    }
                    return null;
                })->filter()->values()->toArray();
                
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'description' => $class->description ?? null,
                    'subjects' => $subjects,
                ];
            })
            ->values()
            ->toArray();
        
        return Inertia::render('admin/ManageScores', [
            'initialAcademicSession' => $currentSession,
            'initialCurrentTerm' => $currentTerm,
            'initialTeacherAssignments' => $teacherAssignments,
        ]);
    })->name('manage-scores');
    Route::get('/attendance', function () {
        return Inertia::render('teacher/Attendance');
    })->name('attendance');
    Route::get('/results', [ScoreController::class, 'adminIndex'])->name('results');
    Route::get('/students/{student}/details', [AdminController::class, 'getStudent'])->name('students.details');
    Route::get('/student-results/{student}', [ScoreController::class, 'teacherStudentResults'])->name('student-results');
    Route::get('/profile', [TeacherController::class, 'getProfile'])->name('profile');
    Route::put('/profile', [TeacherController::class, 'updateProfile']);
    Route::put('/change-password', [TeacherController::class, 'changePassword']);
    
    // API Routes for Teacher
    Route::get('/attendance/classes', [TeacherController::class, 'getClasses']);
    Route::get('/attendance/students', [TeacherController::class, 'getClassStudentsForAttendance']);
    Route::get('/attendance/records', [AttendanceController::class, 'getAttendanceRecords']);
    Route::post('/attendance/mark', [AttendanceController::class, 'markAttendance']);
    Route::get('/scores/assignments', [TeacherController::class, 'getAssignments']);
    Route::get('/scores/students', [ScoreController::class, 'getStudentsForClassSubject']);
    Route::get('/scores/existing', [ScoreController::class, 'getExistingScores']);
    Route::get('/students/{student}/scores', [ScoreController::class, 'getStudentScores']);
    Route::post('/scores', [ScoreController::class, 'store']);
    Route::put('/scores/{score}', [ScoreController::class, 'update']);
    Route::delete('/scores/{score}', [ScoreController::class, 'destroy']);
});

// API Routes - Academic Sessions (accessible to all authenticated users)
// Route for Sanctum authenticated users (admin/teacher)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/academic-sessions/current', [AcademicSessionController::class, 'current']);
});

// Route for student guard authenticated users
Route::middleware(['auth:student'])->group(function () {
    Route::get('/student/academic-sessions/current', [AcademicSessionController::class, 'current']);
});


// Logout (all authenticated users)
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
