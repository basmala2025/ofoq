import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

// Interfaces for strong typing
export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Course {
  courseId: string; // Course ID from API
  title: string;
  code: string;
  description: string;
  professorIds: string[];
  taIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private http = inject(HttpClient);

  // Base URL for the Backend API
  private baseUrl = 'https://ofoqai.runasp.net/api';

  // State Management using Signals
  users = signal<User[]>([]);
  courses = signal<Course[]>([]);

  constructor() {
    this.loadInitialData();
  }

  // Initial data fetch for users and courses
  loadInitialData() {
    this.getUsers().subscribe();
    this.getCourses().subscribe();
  }

  // ================= COURSES APIS =================

  // Fetch all courses with their respective instructors
  getCourses() {
    return this.http.get<any>(`${this.baseUrl}/Courses/with-instructors`).pipe(
      map(response => {
        // 1. Extract the courses array from various possible response structures
        const coursesArray = response.courses ? response.courses : (response.data ? response.data : response);

        // 2. Map the API course structure to our local Course interface
        return coursesArray.map((c: any) => ({
          courseId: c.courseId,
          title: c.title,
          code: c.code,
          description: c.description,
          professorIds: c.doctors ? c.doctors.map((d: any) => d.userId) : [],
          taIds: c.teachingAssistants ? c.teachingAssistants.map((ta: any) => ta.userId) : []
        }));
      }),
      tap(data => {
        console.log('Mapped Courses for UI:', data); // Debugging log
        this.courses.set(data);
      })
    );
  }

  // Create a new course
  createCourse(courseData: Course) {
    // POST /api/Courses
    return this.http.post<Course>(`${this.baseUrl}/Courses`, courseData).pipe(
      tap(() => this.getCourses().subscribe()) // Reload after creation
    );
  }

  // Update course details
  updateCourse(id: string, courseData: Course) {
    // PUT /api/Courses/{id}
    const payload = { ...courseData, courseId: id };
    return this.http.put(`${this.baseUrl}/Courses/${id}`, payload).pipe(
      tap(() => this.getCourses().subscribe())
    );
  }

  // Delete a course by ID
  deleteCourse(id: string) {
    // DELETE /api/Courses/{id}
    return this.http.delete(`${this.baseUrl}/Courses/${id}`).pipe(
      tap(() => this.getCourses().subscribe())
    );
  }

  // ================= USERS APIS =================

  // Helper to map string roles to numeric enums required by the backend
  private mapRoleToNumber(role: string): number {
    switch (role) {
      case 'Admin': return 0;
      case 'Professor': return 1;
      case 'TA': return 2;
      case 'Student': return 3;
      default: return 3;
    }
  }

  // Fetch all registered users
  getUsers() {
    return this.http.get<any>(`${this.baseUrl}/Users`).pipe(
      map(response => response.users ? response.users : []),
      tap(data => {
        this.users.set(data);
      })
    );
  }

  // Invite a new user by sending an email and assigning a role
  inviteUser(email: string, roleName: string, adminId: string) {
    const payload = {
      email: email,
      assignedRole: this.mapRoleToNumber(roleName), // Convert string to number
      invitedByUserId: adminId // Current logged-in Admin ID
    };
    return this.http.post<any>(`${this.baseUrl}/Users/invite`, payload).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }

  // Update existing user profile
  updateUser(id: string, userData: { fullName: string, email: string, role: string }) {
    const payload = {
      userId: id,
      fullName: userData.fullName,
      email: userData.email,
      role: this.mapRoleToNumber(userData.role) // Convert string to number
    };
    return this.http.put(`${this.baseUrl}/Users/${id}`, payload).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }

  // Delete a user account by ID
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/Users/${id}`).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }
}
