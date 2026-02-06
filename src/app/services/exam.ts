import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/submissions`;

  constructor(private http: HttpClient) {}

  submitExam(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
