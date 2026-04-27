import { Component, inject } from '@angular/core';
import { Navbar } from "../dashboard/navbar/navbar";
import { homedashboard } from "./homedashboard/homedashboard";
import { Router } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, homedashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private router = inject(Router);
  private authService = inject(AuthService);

  onLogout(): void {
    const refreshToken = localStorage.getItem('refreshToken');

    this.authService.logout({ refreshToken: refreshToken, revokeAllDevices: false }).subscribe({
      next: () => {
        this.finalizeLogout();
      },
      error: (err) => {
        console.error('Logout error from server:', err);
        this.finalizeLogout();
      }
    });
  }

  private finalizeLogout() {
    localStorage.clear(); 
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
