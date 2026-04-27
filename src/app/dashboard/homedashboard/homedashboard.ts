import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data';
import { Course } from '../../models/data.model';

@Component({
  selector: 'app-homedashboard',
  templateUrl: './homedashboard.html',
  styleUrls: ['./homedashboard.css'],
  standalone: true,
  imports: [RouterLink] // Required for routing when a course card is clicked
})
export class homedashboard implements OnInit {
  public dataService = inject(DataService);

  ngOnInit(): void {
    // Retrieve and normalize user role from local storage
    const userRole = localStorage.getItem('role')?.toLowerCase() || '';

    if (userRole === 'admin' || userRole === '3') {
      // Logic for Admin role (currently commented out)
      // this.dataService.loadAllCourses().subscribe();
    }
    else if (userRole.includes('prof') || userRole === '2' || userRole.includes('ta') || userRole === '1') {

      // Optimization: Only trigger the API call if the courses signal is currently empty
      if (this.dataService.courses().length === 0) {
        console.log('▶️ Fetching assigned courses from API...');
        this.dataService.loadAssignedCourses().subscribe();
      } else {
        console.log('✅ Courses already loaded, skipping API call.');
      }

    }
    else if (userRole.includes('std') || userRole === '0') {
      // Logic for Student role (currently commented out)
      // this.dataService.loadMyCourses().subscribe();
    }
  }

  /**
   * Optional helper method triggered when a course is clicked.
   * Note: Actual navigation is handled by RouterLink in the template.
   */
  onCourseClick(course: Course) {
    console.log('Course clicked:', course.title);
  }
}
