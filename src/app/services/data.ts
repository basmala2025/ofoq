import { Injectable } from '@angular/core';
import { Course, DoctorProfile, Session } from '../models/data.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Data {
  private mockCourses: Course[] = [
    { id: 1, name: 'Data Structures', code: 'CS201', icon: 'DS' },
    { id: 2, name: 'Algorithms', code: 'CS301', icon: 'AL' },
    { id: 3, name: 'Database Systems', code: 'CS305', icon: 'DB' },
    { id: 4, name: 'Software Engineering', code: 'CS401', icon: 'SE' },
    { id: 5, name: 'Machine Learning', code: 'CS501', icon: 'ML' },
    { id: 6, name: 'Computer Networks', code: 'CS302', icon: 'CN' }
  ];

  // بيانات الجلسات المحدثة (أضفت focusLevel لكل جلسة)
  private mockSessions: Session[] = [
    { id: 101, courseId: 1, date: 'Dec 20, 2025', duration: '90 min', attendance: '95%', focus: '87%', focusLevel: 'High' },
    { id: 102, courseId: 1, date: 'Dec 18, 2025', duration: '120 min', attendance: '92%', focus: '82%', focusLevel: 'Medium' },
    { id: 103, courseId: 2, date: 'Dec 15, 2025', duration: '90 min', attendance: '98%', focus: '91%', focusLevel: 'High' },
    { id: 104, courseId: 1, date: 'Dec 10, 2025', duration: '90 min', attendance: '70%', focus: '55%', focusLevel: 'Low' }
  ];

  private mockProfile: DoctorProfile = {
    name: 'Dr. Ahmed Hassan',
    fullName: 'Dr. Ahmed Hassan Mohamed',
    email: 'ahmed.hassan@ofoq.edu',
    department: 'Computer Science',
    position: 'Associate Professor',
    avatar: 'AH'
  };

  constructor() { }

  // --- Methods ---

  getCourses(): Course[] {
    return this.mockCourses;
  }

  getCourseById(id: number): Course | undefined {
    return this.mockCourses.find(c => c.id === id);
  }

  getDoctorProfile(): DoctorProfile {
    return this.mockProfile;
  }

  getSessionsByCourse(courseId: number): Session[] {
    // الآن لن يظهر خطأ هنا لأن Session أصبح يعرف ما هو courseId
    return this.mockSessions.filter(s => s.courseId === courseId);
  }

  updatePassword(currentPass: string, newPass: string): Observable<boolean> {
    console.log('Sending to API:', { currentPass, newPass });
    return of(true);
  }

  startNewSession(sessionData: { courseId: number, room: string }): Observable<boolean> {
    console.log('API Request: Starting Session...', sessionData);
    return of(true);
  }
}
