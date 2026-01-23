import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common'; // مهم جداً لاستخدام *ngIf

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  fullName: string = '';
  displayName: string = '';
  initials: string = '';
  userRole: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // دالة للتحقق من حالة تسجيل الدخول لاستخدامها في الـ HTML
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  loadUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.fullName = user.fullName || 'User';
        this.userRole = user.userType || user.role || '';
        this.initials = this.getInitials(this.fullName);

        let formatted = this.formatName(this.fullName);
        this.displayName = this.userRole === 'professor' ? `Dr. ${formatted}` : formatted;

      } catch (e) {
        this.displayName = 'User';
        this.initials = 'U';
      }
    }
  }

  goToProfile(): void {
    const target = this.userRole === 'professor' ? '/profprofile' : '/stdprofile';
    this.router.navigate([target]);
  }

  getInitials(name: string): string {
    return name.split(' ').filter(p => p.length > 0).map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }

  formatName(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : (parts[0] || 'User');
  }

  // دالة الخروج المحدثة
  logout(): void {
    // 1. مسح كل بيانات الجلسة
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken'); // ضروري جداً لتعطيل الـ AuthGuard

    // 2. تصفير المتغيرات المحلية
    this.displayName = '';
    this.userRole = '';
    this.fullName = '';
    this.initials = '';

    // 3. التوجيه لصفحة الـ Login مع منع الرجوع للخلف
    this.router.navigate(['/login'], { replaceUrl: true });

    console.log('Logged out and history cleared.');
  }
}
