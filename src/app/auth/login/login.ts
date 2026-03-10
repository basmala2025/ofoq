import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private readonly apiUrl = 'https://ofoqai.runasp.net/api/Auth/login';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@edu\.bu\.eg$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.http.post(this.apiUrl, credentials).subscribe({
        next: (res: any) => {
          localStorage.setItem('userToken', res.token);
          localStorage.setItem('userRole', res.role); 
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(res));

          this.navigateByRole(res.role);
        },
        error: (err) => {
          console.error('Login Error:', err);
          alert('بيانات الدخول غير صحيحة أو توجد مشكلة في الاتصال.');
          this.isLoading = false;
        }
      });
    }
  }

  private navigateByRole(role: any) {
    switch(role.toString()) {
      case '3':
      case 'super_admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case '2':
      case 'ta':
        this.router.navigate(['/ta-dashboard']);
        break;
      case '1':
      case 'professor':
        this.router.navigate(['/dashboard']);
        break;
      case '0':
      case 'student':
      default:
        this.router.navigate(['/dashboardstudent']);
        break;
    }
  }
}
