import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router'; // أضفنا الـ Router
import { OrdinalPipe } from '../pipes/ordinal-pipe';
import { SpacePipe } from '../pipes/space-pipe';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, RouterModule, OrdinalPipe, SpacePipe],
  templateUrl: './course-selection.html',
  styleUrls: ['./course-selection.css']
})
export class CoursesPageComponent {
  selectedYear = 1;

  courses = {
    dataStructures: true,
    algorithms: true,
    webDevelopment: true,
    databaseSystems: false,
    machineLearning: false
  };

  years = [1, 2, 3, 4];

  constructor(private router: Router) {} // تعريف الـ Router

  // دالة للانتقال الآمن للداشبورد
  goToDashboard() {
    // 1. حفظ الكورسات المختارة (اختياري عشان السيستم يفتكرها)
    localStorage.setItem('selectedCourses', JSON.stringify(this.courses));
    localStorage.setItem('academicYear', this.selectedYear.toString());

    // 2. التأكد من أن الدور هو 'student' قبل الانتقال
    const role = localStorage.getItem('userRole');
    if (role === 'student') {
      this.router.navigate(['/dashboardstudent']); //
    } else {
      // لو فيه غلط في الـ Role، بنرجعه للـ Login عشان "يفوق"
      console.error('Role mismatch detected!');
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
