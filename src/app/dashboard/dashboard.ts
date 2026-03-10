import { Component } from '@angular/core';
import { Navbar } from "../dashboard/navbar/navbar";
import { homedashboard } from "./homedashboard/homedashboard";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, homedashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
constructor(private router: Router) {}

  onLogout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
