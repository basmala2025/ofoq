// src/app/models/schema.model.ts

export type UserRole = 'admin' | 'prof' | 'std' | 'ta';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  courses?: string[];
  enrolledInstructors?: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string; // تم التعديل لتطابق الـ API والـ Component
  professorIds: string[]; // تم التعديل لتطابق الـ API
  taIds: string[]; // تم التعديل لتطابق الـ API
  description?: string;
  isPublished?: boolean;
}

export interface Session {
  id: string | number;
  courseId: string | number;
  date: string;       
  duration: string;
  attendance: string;
  focus: string;
  focusLevel: 'High' | 'Medium' | 'Low';
  violations?: number;
}

export interface DoctorProfile {
  name: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
}
