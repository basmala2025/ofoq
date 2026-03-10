import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'std' | 'prof' | 'ta' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  courses: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  professorIds: string[];
  taIds: string[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private usersSubject = new BehaviorSubject<User[]>([
    { id: '1', name: 'Dr. Ahmed Salem', email: 'ahmed.s@ofoq.edu', role: 'prof', status: 'active', courses: ['c1'] },
    { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@ofoq.edu', role: 'ta', status: 'active', courses: ['c1'] },
    { id: '3', name: 'John Doe', email: 'john.d@student.ofoq.edu', role: 'std', status: 'active', courses: ['c1'] },
    { id: '4', name: 'Super Admin', email: 'admin@ofoq.edu', role: 'admin', status: 'active', courses: [] },
  ]);

  private coursesSubject = new BehaviorSubject<Course[]>([
    { id: 'c1', name: 'Advanced Algorithms', code: 'CS401', description: 'Deep dive into complex algorithms and data structures.', professorIds: ['1'], taIds: ['2'] }
  ]);

  users = signal<User[]>(this.usersSubject.value);
  courses = signal<Course[]>(this.coursesSubject.value);

  inviteUser(email: string, role: UserRole) {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Pending Invitation',
      email,
      role,
      status: 'invited',
      courses: []
    };
    this.updateUsersState([...this.users(), newUser]);
  }

  updateUser(updatedUser: User) {
    const updated = this.users().map(u => u.id === updatedUser.id ? updatedUser : u);
    this.updateUsersState(updated);
  }

  deleteUser(id: string) {
    const updated = this.users().filter(u => u.id !== id);
    this.updateUsersState(updated);
  }

  addCourse(courseData: Omit<Course, 'id'>) {
    const newCourse: Course = { ...courseData, id: Math.random().toString(36).substr(2, 9) };
    this.updateCoursesState([...this.courses(), newCourse]);
    this.syncUserCourses(newCourse, [...courseData.professorIds, ...courseData.taIds]);
  }

  updateCourse(updatedCourse: Course) {
    const updated = this.courses().map(c => c.id === updatedCourse.id ? updatedCourse : c);
    this.updateCoursesState(updated);
    this.syncUserCourses(updatedCourse, [...updatedCourse.professorIds, ...updatedCourse.taIds]);
  }

  deleteCourse(id: string) {
    const updated = this.courses().filter(c => c.id !== id);
    this.updateCoursesState(updated);
  }

  private updateUsersState(users: User[]) {
    this.users.set(users);
    this.usersSubject.next(users);
  }

  private updateCoursesState(courses: Course[]) {
    this.courses.set(courses);
    this.coursesSubject.next(courses);
  }

  private syncUserCourses(course: Course, staffIds: string[]) {
    const updatedUsers = this.users().map(u => {
      const hasCourse = u.courses.includes(course.id);
      const isAssigned = staffIds.includes(u.id);
      if (isAssigned && !hasCourse) return { ...u, courses: [...u.courses, course.id] };
      else if (!isAssigned && hasCourse) return { ...u, courses: u.courses.filter(id => id !== course.id) };
      return u;
    });
    this.updateUsersState(updatedUsers);
  }
}
