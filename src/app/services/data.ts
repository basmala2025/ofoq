import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Course, Session } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  // 1. Base URL for the Backend API
  private baseUrl = 'https://ofoqai.runasp.net/api';

  // 2. Signal to store and manage the courses state
  courses = signal<Course[]>([]);

  constructor() { }

  /**
   * Fetches courses assigned to the current user and maps the response
   * to ensure compatibility with the frontend 'id' property.
   */
  loadAssignedCourses() {
    return this.http.get<any>(`${this.baseUrl}/Courses/assigned`).pipe(
      map(response => {
        // 1. Extract the array from various possible response structures
        let coursesArray = [];
        if (Array.isArray(response)) {
          coursesArray = response;
        } else {
          coursesArray = response.courses ? response.courses : (response.data ? response.data : []);
        }

        // 2. Mapping logic: Ensure every course object has an 'id' property
        return coursesArray.map((c: any) => {
          return {
            ...c, // Spread existing properties
            id: c.courseId || c.id // Ensure 'id' exists whether backend sends courseId or id
          };
        });
      }),
      tap((coursesData: Course[]) => {
        console.log('✅ Assigned Courses Mapped:', coursesData);
        this.courses.set(coursesData);
      })
    );
  }

  /**
   * Creates a new lecture for a specific course using FormData.
   * Includes a dummy PDF file to satisfy backend requirements for file uploads.
   */
  createLecture(courseId: string) {
    const formData = new FormData();

    // 1. Textual fields
    formData.append('title', `Lecture - ${new Date().toLocaleDateString()}`);
    formData.append('description', 'AI Session Initiation');
    formData.append('lectureDate', new Date().toISOString());

    // 2. Dummy File Creation: Generates a minimal valid-header PDF blob
    const pdfContent = "%PDF-1.4\n1 0 obj\n<< /Title (Dummy PDF) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF";
    const dummyFile = new File([pdfContent], "lecture_start.pdf", { type: "application/pdf" });

    // 3. Append the dummy file to the 'file' field
    formData.append('file', dummyFile);

    console.log('📤 Sending FormData with a dummy PDF file...');

    return this.http.post<any>(`${this.baseUrl}/courses/${courseId}/lectures`, formData);
  }

  /**
   * Synchronously finds a course from the local signal state by its ID.
   */
  getCourseById(id: string): Course | undefined {
    const allCourses = this.courses();
    // Uses the 'id' property defined in the local model
    return allCourses.find(c => c.id === id);
  }

  /**
   * Retrieves past sessions for a specific course.
   * Currently returns an empty array as a placeholder for future API integration.
   */
  getSessionsByCourse(courseId: string): Session[] {
    // TODO: Implement HTTP GET request when the Sessions API is ready
    return [];
  }
}
