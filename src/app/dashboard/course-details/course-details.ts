import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importing services and models
import { DataService } from '../../services/data';
import { Course, Session } from '../../models/data.model';
import { Navbar } from "../navbar/navbar";
import { AudioRecordingService } from '../audio-recording.service.ts'; // Removed .ts extension for clean import

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {
  activeTab: 'active' | 'past' | 'results' = 'active';
  course?: Course;
  pastSessions: any[] = []; // Temporary 'any' type for mock data
  studentsResults: any[] = [];
  selectedRoom: string = 'Room A - Building 1';

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private router = inject(Router);
  private audioService = inject(AudioRecordingService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔗 Requested Course ID:', id);

    if (id) {
      // 1. Attempt to find the course in the pre-loaded data state
      const existingCourse = this.dataService.courses().find((c: any) => c.id === id || c.courseId === id);

      if (existingCourse) {
        this.course = existingCourse;
        this.setupStaticData();
      } else {
        // 2. If not found, trigger API reload then search again
        this.dataService.loadAssignedCourses().subscribe(() => {
          this.course = this.dataService.courses().find((c: any) => c.id === id || c.courseId === id);
          if (this.course) {
            this.setupStaticData();
          } else {
            console.error('❌ Course not found even after API call!');
          }
        });
      }
    }
  }

  // --- Helper to populate static mock data ---
  private setupStaticData() {
    // 1. Static data for past lecture sessions
    this.pastSessions = [
      { id: '1', date: 'Oct 15, 2025', duration: '1h 20m', attendance: '45/50', focus: '88%', focusLevel: 'High' },
      { id: '2', date: 'Oct 12, 2025', duration: '1h 15m', attendance: '48/50', focus: '75%', focusLevel: 'Medium' },
      { id: '3', date: 'Oct 08, 2025', duration: '1h 30m', attendance: '40/50', focus: '60%', focusLevel: 'Low' },
    ];

    // 2. Static data for student performance results
    this.studentsResults = [
      { id: '1', studentName: 'Ahmed Ali', date: 'Oct 10, 2025', violations: 0, score: 95, status: 'Passed' },
      { id: '2', studentName: 'Sarah Mahmoud', date: 'Oct 10, 2025', violations: 2, score: 70, status: 'Passed' },
      { id: '3', studentName: 'Omar Khaled', date: 'Oct 10, 2025', violations: 5, score: 45, status: 'Failed' },
    ];
  }

  // Handle the logic to start a live session
  onStartSession() {
    if (this.course) {
      this.dataService.createLecture(this.course.id).subscribe({
        next: (response) => {
          // Extract ID from various possible response formats
          const newId = response.id || response.lectureId || (response.data?.id);

          if (newId) {
            // Start audio recording before navigating
            this.audioService.startRecording().then(() => {
              // ✅ Short delay to ensure microphone stability before transition
              setTimeout(() => {
                this.router.navigate(['/livedashboard', newId], {
                  queryParams: { course: this.course?.title, room: this.selectedRoom }
                });
              }, 800);
            });
          }
        },
        error: (err) => alert('Failed to create lecture session')
      });
    }
  }

  // Placeholder for viewing detailed session analytics
  viewSessionAnalytics(session: any) {
    alert(`Session Analytics:\nDate: ${session.date}\nAverage Focus: ${session.focus}`);
  }
}
