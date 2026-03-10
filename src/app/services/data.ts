import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { Course, DoctorProfile, Session, User } from '../models/data.model';

@Injectable({ providedIn: 'root' })
export class Data {
  private USERS_KEY = 'ofoq_users_db';
  private COURSES_KEY = 'ofoq_courses_db';
  private apiUrl = 'http://localhost:3000/api';

  // بيانات الجلسات للعرض (Mock Data)
  private mockSessions: Session[] = [
    { id: 101, courseId: 1, date: 'Dec 20, 2025', duration: '90 min', attendance: '95%', focus: '87%', focusLevel: 'High' }
  ];

  constructor(private http: HttpClient) {
    // تشغيل التهيئة بمجرد بدء الخدمة
    this.initializeStorage();
  }

  /**
   * تهيئة الـ LocalStorage بالبيانات الافتراضية إذا كان فارغاً
   */
  private initializeStorage() {
    if (!localStorage.getItem(this.COURSES_KEY)) {
      const defaultCourses = [
        { id: 1, name: 'Data Structures', code: 'CS201', icon: 'DS', professor: 'Dr. Ahmed Hassan' }
      ];
      localStorage.setItem(this.COURSES_KEY, JSON.stringify(defaultCourses));
    }

    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultAdmin = [
        { id: '1', fullName: 'Basmala Admin', email: 'admin@ofoq.com', userType: 'super_admin', status: 'active', enrolledCourses: [] }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultAdmin));
    }
  }

  /**
   * إدارة المستخدمين (Users Management)
   */
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  deleteUser(userId: string): void {
    let users = this.getUsers();
    users = users.filter(user => user.id !== userId);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    console.log(`OFOQ: User ${userId} removed.`);
  }

  /**
   * إرسال دعوة (Invite User)
   * قمت بتعديلها لتعمل بالمحاكاة إذا فشل السيرفر، لمنع تعليق المتصفح
   */
  inviteNewUser(email: string, role: string): Observable<any> {
    const payload = { email, role, invitedAt: new Date(), platform: 'OFOQ' };

    // محاولة الإرسال للباك إند الحقيقي
    return this.http.post(`${this.apiUrl}/users/invite`, payload).pipe(
      catchError((error) => {
        // إذا كان السيرفر غير موجود (بورت 3000 مغلق)، نقوم بالمحاكاة فوراً
        console.warn('OFOQ Backend not found. Running in Simulation Mode...');

        // محاكاة استجابة ناجحة بعد ثانية واحدة لتهدئة الـ CPU
        return of({ status: 'success', message: 'Simulated success' }).pipe(delay(1000));
      })
    );
  }

  /**
   * إدارة الكورسات والجلسات
   */
  getCourses(): Course[] {
    return JSON.parse(localStorage.getItem(this.COURSES_KEY) || '[]');
  }

  getCourseById(id: number): Course | undefined {
return this.getCourses().find(c => String(c.id) === String(id));  }

  getSessionsByCourse(courseId: number): Session[] {
    return this.mockSessions.filter(s => s.courseId === courseId);
  }

  /**
   * بيانات البروفايل (Profile Data)
   */
  getDoctorProfile(): DoctorProfile {
    return {
      name: 'Dr. Ahmed Hassan',
      fullName: 'Dr. Ahmed Hassan Mohamed',
      email: 'ahmed.hassan@ofoq.edu',
      department: 'CS',
      position: 'Professor',
      avatar: 'AH'
    };
  }

  updatePassword(current: string, newP: string): Observable<boolean> {
    return of(true).pipe(delay(800));
  }
}
