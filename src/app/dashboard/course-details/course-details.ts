import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ضروري لعمل ngModel
import { Data } from '../../services/data'; // تأكد من صحة المسار للسيرفس
import { Course, Session } from '../../models/data.model';
import { Navbar } from "../navbar/navbar";
import {  Router } from '@angular/router';
@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {
  activeTab: 'active' | 'past' = 'active';
  course?: Course;
  pastSessions: Session[] = [];

  // يجب تعريف هذا المتغير ليستخدمه ngModel في الـ HTML
  selectedRoom: string = 'Room A - Building 1';

  constructor(
    private route: ActivatedRoute,
    private dataService: Data,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.dataService.getCourseById(id);
    this.pastSessions = this.dataService.getSessionsByCourse(id);
  }

 onStartSession() {
  if (this.course) {
    console.log('Navigating to Live Dashboard for Course ID:', this.course.id);

    this.router.navigate(['/livedashboard', this.course.id]);
  }
}}
