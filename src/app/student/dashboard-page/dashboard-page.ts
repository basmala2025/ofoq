import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from "../../dashboard/navbar/navbar";
import { RouterLink } from '@angular/router'; 
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
  imports: [Navbar,RouterLink]
})
export class DashboardPageComponent implements OnInit {
  stats = {
    available: 3,
    completed: 12,
    average: 88
  };

  exams = [
    { title: 'Midterm Data Structures', course: 'Data Structures', time: 60 },
    { title: 'Final Algorithms Quiz', course: 'Algorithms', time: 45 },
    { title: 'Web Development Basics', course: 'Web Dev', time: 30 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
