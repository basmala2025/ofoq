// src/app/pages/courses-page/courses-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { OrdinalPipe } from '../pipes/ordinal-pipe';
import { SpacePipe } from '../pipes/space-pipe';
@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, RouterModule,OrdinalPipe,
    SpacePipe,],
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
}
