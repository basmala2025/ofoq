import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-ta',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'dashboard-ta.html',
  styleUrl:'dashboard-ta.css',
})
export class App {
  // State Signals
  activeTab = signal('dashboard');

  // Mock Data
  tutorName = signal('Ahmed');

  stats = signal({
    upcoming: 3,
    running: 1,
    attendance: 85
  });

  courses = signal([
    { id: 1, code: 'CS201', title: 'Data Structures & Algorithms', students: 120 },
    { id: 2, code: 'CS105', title: 'Intro to Web Development', students: 95 },
    { id: 3, code: 'AI301', title: 'AI Fundamentals', students: 80 }
  ]);

  // Methods
  switchTab(tabId: string) {
    this.activeTab.set(tabId);
  }
}
