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
  initials: string = ''; // متغير جديد للحروف الأولى

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
        this.displayName = this.formatName(this.fullName);
        this.initials = this.getInitials(this.fullName); // استخراج الحروف
      } catch (e) {
        this.displayName = 'User';
        this.initials = 'U';
      }
    } else {
      this.displayName = '';
      this.initials = '';
    }
  }

  // دالة لتحويل الاسم لحروف (مثلاً: Ahmed Hassan -> AH)
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatName(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `Dr. ${parts[0]} ${parts[1]}`;
    }
    return `Dr. ${parts[0] || 'User'}`;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.displayName = '';
    this.router.navigate(['/login']);
  }
}
