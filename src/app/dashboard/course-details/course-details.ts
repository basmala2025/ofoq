import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { Course, Session } from '../../models/data.model';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {
  // تحديث الخيارات لتشمل التاب الجديد 'results'
  activeTab: 'active' | 'past' | 'results' = 'active';
  course?: Course;
  pastSessions: Session[] = [];
  studentsResults: any[] = [];

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

    // تحميل نتائج الطلاب المسجلين عند بدء تشغيل الصفحة
    this.loadExamResults(id);
  }

  loadExamResults(courseId: number) {
    // جلب البيانات من سجل النتائج العام المخزن محلياً
    const allData = JSON.parse(localStorage.getItem('all_students_results') || '[]');
    // تصفية البيانات لعرض طلاب هذا الكورس فقط
    this.studentsResults = allData.filter((res: any) => res.courseId === courseId);
  }

  onStartSession() {
    if (this.course) {
      this.router.navigate(['/livedashboard', this.course.id]);
    }
  }
}
