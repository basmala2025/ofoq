import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly apiUrl = 'https://ofoqai.runasp.net/api/Auth/register';

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      id: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@edu\.bu\.eg$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;

      const payload = {
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword,
        academicId: this.signupForm.value.id,
        role: 0
      };

      this.http.post(this.apiUrl, payload).subscribe({
        next: (res: any) => {
          localStorage.setItem('userToken', res.token);
          localStorage.setItem('userRole', '0');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(res));

          this.router.navigate(['/dashboardstudent'], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Signup Error:', err);
          const errorMessage = err.error?.message || 'فشل إنشاء الحساب. تأكد من البيانات أو الاتصال.';
          alert(errorMessage);
          this.isLoading = false;
        }
      });
    }
  }
}
