// src/app/models/schema.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'prof' | 'std' | 'ta';
  status: 'active' | 'invited';
  courses?: string[]; // IDs of courses
  enrolledInstructors?: string[]; // For Students only
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professors: string[]; // IDs of Doctors
  teachingAssistants: string[]; // IDs of TAs
  isPublished: boolean;
}


export interface Session {
  id: number;
  courseId: number;
  date: string;
  duration: string;
  attendance: string;
  focus: string;
  focusLevel: 'High' | 'Medium' | 'Low';
}

export interface DoctorProfile {
  name: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
}
