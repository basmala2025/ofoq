import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  examTitle: string = 'Binary Trees Quiz';
  category: string = 'Data Structures';
  score: number = 85;
  timeTaken: string = '12:45';
  totalLines: number = 15;

  testCases = [
    { name: 'Test Case 1: Basic tree', status: 'Passed', passed: true },
    { name: 'Test Case 2: Single node', status: 'Passed', passed: true },
    { name: 'Test Case 3: Unbalanced tree', status: 'Failed', passed: false },
    { name: 'Test Case 4: Empty tree', status: 'Passed', passed: true }
  ];

  constructor(
    private router: Router,
    private locationStrategy: LocationStrategy
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.preventBackButton();
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  get passedCount(): number {
    return this.testCases.filter(t => t.passed).length;
  }

  goHome() {
    this.router.navigate(['/dashboardstudent'], { replaceUrl: true });
  }

  reviewSolution() {
    this.router.navigate(['/dashboardstudent']);
  }
}
