import { Component, OnInit } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  examTitle: string = '';
  category: string = '';
  score: number = 0;
  timeTaken: string = '';
  totalLines: number = 0;
  testCases: any[] = [];
  violations: number = 0;

  constructor(
    private router: Router,
    private locationStrategy: LocationStrategy
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.preventBackButton();
    this.loadRealResults();
  }

  loadRealResults() {
    const data = localStorage.getItem('ofoq_last_result');
    if (data) {
      const parsed = JSON.parse(data);
      this.examTitle = parsed.examTitle;
      this.category = parsed.category;
      this.score = parsed.score;
      this.timeTaken = parsed.timeTaken;
      this.totalLines = parsed.totalLines;
      this.testCases = parsed.testCases;
      this.violations = parsed.violations;
    } else {
      this.router.navigate(['/dashboardstudent']);
    }
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  get passedCount(): number {
    return this.testCases ? this.testCases.filter(t => t.passed).length : 0;
  }

  goHome() {
    localStorage.removeItem('ofoq_last_result');
    this.router.navigate(['/dashboardstudent'], { replaceUrl: true });
  }
}
