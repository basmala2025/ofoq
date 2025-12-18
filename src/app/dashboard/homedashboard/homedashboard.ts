import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from "../navbar/navbar";
interface Course {
  id: number;
  name: string;
  code: string;
  room: string;
  sessions: number;
  selectedRoom?: string;
}

@Component({
  selector: 'app-homedashboard',
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './homedashboard.html',
  styleUrls: ['./homedashboard.css']
})
export class Homedashboard {
  // Statistics for summary tiles
  constructor(private router: Router) {}

  stats = {
    registeredStudents: 142,
    todaysSessions: 3
  };

  // Courses list (you can later load this from a service)
  courses: Course[] = [
    { id: 1, name: 'Artificial Intelligence', code: 'AI-401', room: 'A-101', sessions: 2 },
    { id: 2, name: 'Machine Learning', code: 'ML-202', room: 'B-303', sessions: 1 },
    { id: 3, name: 'Data Mining', code: 'DM-305', room: 'C-201', sessions: 3 },
    { id: 4, name: 'Computer Vision', code: 'CV-102', room: 'D-104', sessions: 2 },
  ];

  activateCamera(course: Course) {
    if (!course.selectedRoom) {
      alert(`Please select a room for ${course.name}`);
      return;
    }

    console.log(`Activating camera for ${course.name} in ${course.selectedRoom}`);
   this.router.navigate(['/livedashboard'], {
  queryParams: {
    course: course.name,
    room: course.selectedRoom
  }
});

}
}
