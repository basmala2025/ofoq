import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Data } from '../../services/data';
import { Course } from '../../models/data.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-homedashboard',
  templateUrl: './homedashboard.html',
  styleUrls: ['./homedashboard.css'],
  imports: [RouterLink]
})
export class homedashboard implements OnInit {
  courses: Course[] = [];

  @Output() courseSelected = new EventEmitter<Course>();

  constructor(private dataService: Data) {}

  ngOnInit(): void {
    this.courses = this.dataService.getCourses();
  }

  onCourseClick(course: Course) {
    this.courseSelected.emit(course);
  }
}
