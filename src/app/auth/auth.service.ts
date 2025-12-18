import { Injectable, Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private academicDomain = '.edu.bu.eg';
  private router: Router;

  // Mock user database
  private users: User[] = [
    { email: 'student@edu.bu.eg', password: '123456', userType: 'student' ,fullName:'Ahmed'},
    { email: 'professor@edu.bu.eg', password: '123456', userType: 'professor',fullName:'Basmala' }
  ];

  constructor(private injector: Injector) {
    this.router = this.injector.get(Router);
  }

  signup(user: User): Observable<any> {
    if (!user.email.endsWith(this.academicDomain)) {
      return throwError(() => new Error('Only academic emails ending with .edu.bu.eg are allowed'));
    }
    // Simulate adding user to database
    this.users.push(user);
    console.log('Sign Up:', user);
    return of({ success: true, user });
  }

  login(email: string, password: string): Observable<any> {
    // Find user in mock database
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log('Login successful:', { email, userType: user.userType });
      return of({ success: true, user: { email: user.email, userType: user.userType } });
    } else {
      console.log('Login failed:', { email });
      return throwError(() => new Error('Invalid email or password'));
    }
  }
}
