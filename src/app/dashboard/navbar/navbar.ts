import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  fullName: string = '';
  displayName: string = '';
  initials: string = '';
  userRole: string = ''; // متغير جديد لتخزين الدور (student أو professor)

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userJson = localStorage.getItem('currentUser');

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.fullName = user.fullName || 'User';
        // جلب الدور من الـ localStorage (تأكدي أن الباك إند يرسله باسم userType أو role)
        this.userRole = user.userType || user.role || '';

        // استخراج الحروف الأولى
        this.initials = this.getInitials(this.fullName);

        // تنسيق الاسم وإضافة لقب Dr. إذا كان دكتور
        let formatted = this.formatName(this.fullName);
        if (this.userRole === 'professor') {
          this.displayName = `Dr. ${formatted}`;
        } else {
          this.displayName = formatted;
        }

      } catch (e) {
        this.displayName = 'User';
        this.initials = 'U';
      }
    }
  }

  // دالة التوجيه بناءً على نوع المستخدم
  goToProfile(): void {
    if (this.userRole === 'professor') {
      this.router.navigate(['/profprofile']); // مسار الدكتور
    } else {
      this.router.navigate(['/stdprofile']); // مسار الطالب
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatName(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return `${parts[0] || 'User'}`;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.displayName = '';
    this.userRole = '';
    this.router.navigate(['/login']);
  }
}
