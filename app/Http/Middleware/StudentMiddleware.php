<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;

class StudentMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get user from the 'student' guard
        $user = Auth::guard('student')->user();
        
        // Check if user is authenticated and is a Student
        if (!$user || !($user instanceof Student)) {
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Student access required.'], 403);
            }
            // Clear any invalid session data
            if ($request->hasSession()) {
                $request->session()->forget('student_id');
                $request->session()->forget('student_token');
            }
            return redirect()->route('student.login');
        }

        return $next($request);
    }
} 