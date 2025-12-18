import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
fullName: string = '';
  displayName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userJson = localStorage.getItem('currentUser');
    // console.log('localStorage:', userJson);

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.fullName = user.fullName || 'user';
        this.displayName = this.formatName(this.fullName);
      } catch (e) {
        this.displayName = 'user';
      }
    } else {
      this.displayName = '';
    }
  }

  formatName(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `Dr. ${parts[0]} ${parts[1]}`;
    }
    return `Dr. ${parts[0] || 'user'}`;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.displayName = '';
    this.router.navigate(['/login']);
  }}
