import { Component, ChangeDetectionStrategy, signal, computed, inject, Injectable, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

// --- MODELS ---
type UserRole = 'std' | 'prof' | 'ta' | 'admin';
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  courses: string[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  professorIds: string[];
  taIds: string[];
}

// --- STATE MANAGEMENT SERVICE ---
@Injectable({ providedIn: 'root' })
export class DataService {
  // حقن الـ Router هنا لحل مشكلة الخطأ في الـ Service
  private router = inject(Router);

  private usersSubject = new BehaviorSubject<User[]>([
    { id: '1', name: 'Dr. Ahmed Salem', email: 'ahmed.s@ofoq.edu', role: 'prof', status: 'active', courses: ['c1'] },
    { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@ofoq.edu', role: 'ta', status: 'active', courses: ['c1'] },
    { id: '3', name: 'Ahmed Omar', email: 'ahmed.omar@student.ofoq.edu', role: 'std', status: 'active', courses: ['c1'] },
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

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-management.html',
  styleUrl: './admin-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  router = inject(Router);

  activeTab = signal<'users' | 'courses'>('users');
  selectedRoleFilter = signal<UserRole | 'all'>('all');

  showUserModal = signal(false);
  editingUser = signal<User | null>(null);
  userForm: FormGroup;

  showCourseModal = signal(false);
  editingCourse = signal<Course | null>(null);
  courseForm: FormGroup;

  viewingUser = signal<User | null>(null);

  roles: { id: UserRole | 'all', label: string }[] = [
    { id: 'all', label: 'All Users' },
    { id: 'std', label: 'Students' },
    { id: 'prof', label: 'Professors' },
    { id: 'ta', label: 'TAs' },
    { id: 'admin', label: 'Admins' },
  ];

  filteredUsers = computed(() => {
    const all = this.dataService.users();
    const filter = this.selectedRoleFilter();
    return filter === 'all' ? all : all.filter(u => u.role === filter);
  });

  professors = computed(() => this.dataService.users().filter(u => u.role === 'prof'));
  tas = computed(() => this.dataService.users().filter(u => u.role === 'ta'));

  constructor() {
    this.userForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['std', Validators.required]
    });

    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      professorIds: [[] as string[], Validators.required],
      taIds: [[] as string[]]
    });
  }

  ngOnInit() {}

  getRoleClass(role: string) {
    return 'badge-' + role;
  }

  openCreateModal() {
    if (this.activeTab() === 'users') {
      this.editingUser.set(null);
      this.userForm.reset({ role: 'std' });
      this.showUserModal.set(true);
    } else {
      this.editingCourse.set(null);
      this.courseForm.reset({ professorIds: [], taIds: [] });
      this.showCourseModal.set(true);
    }
  }

  onLogout() {
    this.dataService.logout();
  }

  // --- ACTIONS (User & Course) ---
  openEditUser(user: User) {
    this.editingUser.set(user);
    this.userForm.patchValue({ name: user.name, email: user.email, role: user.role });
    this.showUserModal.set(true);
  }

  submitUser() {
    if (this.userForm.invalid) return;
    const data = this.userForm.value;
    const currentEdit = this.editingUser();
    if (currentEdit) this.dataService.updateUser({ ...currentEdit, ...data });
    else this.dataService.inviteUser(data.email, data.role);
    this.showUserModal.set(false);
  }

  deleteUser(id: string) {
    if (confirm('Delete this member permanently?')) this.dataService.deleteUser(id);
  }

  openEditCourse(course: Course) {
    this.editingCourse.set(course);
    this.courseForm.patchValue({
      name: course.name,
      code: course.code,
      description: course.description || '',
      professorIds: course.professorIds,
      taIds: course.taIds
    });
    this.showCourseModal.set(true);
  }

  submitCourse() {
    if (this.courseForm.invalid) return;
    const data = this.courseForm.value;
    const currentEdit = this.editingCourse();
    if (currentEdit) this.dataService.updateCourse({ ...currentEdit, ...data });
    else this.dataService.addCourse(data);
    this.showCourseModal.set(false);
  }

  toggleSelection(id: string, field: string) {
    const current = this.courseForm.get(field)?.value || [];
    const updated = current.includes(id) ? current.filter((x: string) => x !== id) : [...current, id];
    this.courseForm.get(field)?.setValue(updated);
  }

  isStaffSelected(id: string, field: string): boolean {
    return this.courseForm.get(field)?.value?.includes(id);
  }

  getStaffNames(ids: string[]): string {
    return this.dataService.users().filter(u => ids.includes(u.id)).map(u => u.name).join(', ') || 'Unassigned';
  }

  getCourseName(id: string): string {
    return this.dataService.courses().find(c => c.id === id)?.name || 'Track Not Found';
  }

  getCourseCode(id: string): string {
    return this.dataService.courses().find(c => c.id === id)?.code || '---';
  }

  viewUserDetails(user: User) {
    this.viewingUser.set(user);
  }
}
