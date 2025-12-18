import { Injectable } from '@angular/core';

interface StudentSummary {
  id: string;
  name: string;
  present: boolean;
  averageFocus: number;
}

interface SessionSummary {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  averageFocus: number;
  students: StudentSummary[];
}

@Injectable({ providedIn: 'root' })
export class SummaryService {
  private summary: SessionSummary | null = null;

  setSummary(summary: SessionSummary): void {
    this.summary = summary;
  }

  getSummary(): SessionSummary | null {
    return this.summary;
  }

  clearSummary(): void {
    this.summary = null;
  }
} 
