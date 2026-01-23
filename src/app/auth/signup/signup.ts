import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // محاكاة تأخير الشبكة (Network Delay)
    setTimeout(() => {
      const { fullName, email, userType } = this.signupForm.value;

      // 1. تجهيز بيانات المستخدم الوهمية
      const mockUser = {
        id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
        fullName: fullName,
        email: email,
        userType: userType // 'professor' أو 'student'
      };

      // 2. تخزين البيانات في LocalStorage (كأننا عملنا Login)
      localStorage.setItem('userToken', 'mock-jwt-token-12345');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      // 3. التوجيه للداش بورد الصحيحة بناءً على النوع
      // استخدمنا replaceUrl: true لمنع الرجوع لصفحة الـ Signup بـ Back
      const target = userType === 'professor' ? '/dashboard' : '/dashboardstudent';

      this.router.navigate([target], { replaceUrl: true });

      this.isLoading = false;
      console.log('Mock Signup & Login Successful:', mockUser);
    }, 1500);
  }
}
