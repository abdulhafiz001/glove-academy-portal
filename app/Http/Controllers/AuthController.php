<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;
use App\Models\Student;

class AuthController extends Controller
{
    /**
     * Login for admin and teachers
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)
                   ->where('is_active', true)
                   ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token for Sanctum - it will use cookies for stateful requests
        $token = $user->createToken('auth-token')->plainTextToken;
        
        // For stateful authentication, Sanctum will handle cookies automatically
        // We still need to authenticate the user for the current request
        Auth::login($user);
        $request->session()->regenerate();

        // Redirect based on role
        if ($user->role === 'teacher') {
            return redirect()->route('teacher.dashboard');
        }
        
        return redirect()->route('admin.dashboard');
    }

    /**
     * Login for students
     * Rate limiting is handled by throttle:login middleware
     */
    public function studentLogin(Request $request)
    {
        $request->validate([
            'admission_number' => 'required|string',
            'password' => 'required|string',
        ]);

        $student = Student::where('admission_number', $request->admission_number)
                         ->where('is_active', true)
                         ->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            throw ValidationException::withMessages([
                'admission_number' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token for Sanctum
        $token = $student->createToken('student-token')->plainTextToken;
        
        // Authenticate the student using the 'student' guard
        // This ensures Sanctum recognizes the student for subsequent requests
        Auth::guard('student')->login($student);
        
        // Store student authentication info in session
        $request->session()->put('student_id', $student->id);
        $request->session()->put('student_token', $token);
        $request->session()->regenerate();

        return redirect()->route('student.dashboard');
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Check if user is a Student (using student guard)
        if ($user instanceof Student) {
            // Logout from student guard
            Auth::guard('student')->logout();
            
            // Delete Sanctum token if it exists
            $token = $user->currentAccessToken();
            if ($token && $token instanceof PersonalAccessToken) {
                $token->delete();
            }
        } else {
            // Regular user (admin/teacher) logout
            // Delete Sanctum token if it exists and is a PersonalAccessToken (not TransientToken)
            if ($user) {
                $token = $user->currentAccessToken();
                // Only delete if it's a PersonalAccessToken (API token), not a TransientToken (session-based)
                if ($token && $token instanceof PersonalAccessToken) {
                    $token->delete();
                }
            }
            
            // Logout from web guard
            Auth::logout();
        }
        
        // Invalidate the session and clear session data
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Clear any Sanctum-related session data
        $request->session()->forget('student_id');
        $request->session()->forget('student_token');

        return redirect()->route('home');
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();
        
        if ($user instanceof Student) {
            return response()->json([
                'user' => $user->load(['schoolClass.formTeacher']),
                'role' => 'student',
            ]);
        }

        return response()->json([
            'user' => $user,
            'role' => $user->role,
        ]);
    }

    /**
     * Verify student identity for password reset
     */
    public function verifyStudentIdentity(Request $request)
    {
        $request->validate([
            'admission_number_or_email' => 'required|string',
        ]);

        $identifier = $request->admission_number_or_email;
        
        // Try to find student by admission number or email
        $student = Student::where(function($query) use ($identifier) {
            $query->where('admission_number', $identifier)
                  ->orWhere('email', $identifier);
        })
        ->where('is_active', true)
        ->first();

        if (!$student) {
            return back()->withErrors([
                'admission_number_or_email' => 'Student not found. Please check your admission number or email.',
            ]);
        }

        // Return minimal student info (no sensitive data) via Inertia
        return back()->with('studentInfo', [
            'id' => $student->id,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'admission_number' => $student->admission_number,
        ]);
    }

    /**
     * Reset student password
     */
    public function resetStudentPassword(Request $request)
    {
        $request->validate([
            'admission_number_or_email' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $identifier = $request->admission_number_or_email;
        
        // Find student by admission number or email
        $student = Student::where(function($query) use ($identifier) {
            $query->where('admission_number', $identifier)
                  ->orWhere('email', $identifier);
        })
        ->where('is_active', true)
        ->first();

        if (!$student) {
            return back()->withErrors([
                'admission_number_or_email' => 'Student not found.',
            ]);
        }

        // Update password
        $student->password = Hash::make($request->password);
        $student->save();

        return redirect()->route('student.login')->with('success', 'Password reset successfully. You can now login with your new password.');
    }
} 