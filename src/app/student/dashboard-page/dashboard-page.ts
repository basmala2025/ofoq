// src/app/pages/dashboard-page/dashboard-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../dashboard/navbar/navbar';
import { Dashboard } from "../../dashboard/dashboard";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, Navbar, Dashboard],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css']
})
export class DashboardPageComponent {
  stats = {
    available: 3,
    completed: 12,
    average: 85
  };

  exams = [
    { title: 'Binary Trees Quiz', course: 'Data Structures', time: 45 },
    { title: 'Sorting Algorithms Test', course: 'Algorithms', time: 60 },
    { title: 'JavaScript Fundamentals', course: 'Web Development', time: 30 }
  ];
}
