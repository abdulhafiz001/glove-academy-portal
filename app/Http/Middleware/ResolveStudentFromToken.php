<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Student;
use Laravel\Sanctum\PersonalAccessToken;

class ResolveStudentFromToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only process if no user is authenticated yet
        if (!$request->user()) {
            // Check if session is available before accessing it
            if ($request->hasSession() && $request->session()->has('student_id')) {
                $studentId = $request->session()->get('student_id');
                $student = Student::find($studentId);
                
                if ($student && $student->is_active) {
                    // Verify token is still valid if stored in session
                    $sessionToken = $request->session()->get('student_token');
                    $tokenValid = false;
                    
                    if ($sessionToken) {
                        $accessToken = PersonalAccessToken::findToken($sessionToken);
                        if ($accessToken && $accessToken->tokenable_id === $student->id) {
                            $tokenValid = true;
                        }
                    }
                    
                    // Set the authenticated user for this request
                    // This will be recognized by Sanctum's auth:sanctum middleware
                    $request->setUserResolver(function () use ($student) {
                        return $student;
                    });
                    
                    // Also set it directly on the request so Sanctum can find it
                    // This is a workaround for Sanctum's authentication flow
                    $request->merge(['_student' => $student]);
                }
            }
            
            // Check for Sanctum token in Authorization header (fallback)
            if (!$request->user()) {
                $token = $request->bearerToken();
                
                if ($token) {
                    // Find the token in the database
                    $accessToken = PersonalAccessToken::findToken($token);
                    
                    if ($accessToken) {
                        // Get the tokenable model (should be Student)
                        $tokenable = $accessToken->tokenable;
                        
                        if ($tokenable instanceof Student && $tokenable->is_active) {
                            // Set the authenticated user for this request
                            $request->setUserResolver(function () use ($tokenable) {
                                return $tokenable;
                            });
                            
                            // Store in session for subsequent requests (if session is available)
                            if ($request->hasSession()) {
                                $request->session()->put('student_id', $tokenable->id);
                                $request->session()->put('student_token', $token);
                            }
                        }
                    }
                }
            }
        }
        
        return $next($request);
    }
}

