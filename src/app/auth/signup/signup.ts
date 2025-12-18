import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://notrealstate.runasp.net/api/Account/Register';
  isLoading :boolean=false

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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

  setTimeout(() => {
    const user = {
      fullName: this.signupForm.value.fullName,
      email: this.signupForm.value.email,
      role: this.signupForm.value.userType === 'professor' ? 'professor' : 'student'
    };

    localStorage.setItem('currentUser', JSON.stringify(user));

    if (user.role === 'professor') {
      this.router.navigate(['/dashboard']);
    }
    if (user.role === 'student') {
      this.router.navigate(['/courses']);
    }

    this.isLoading = false;
  }, 1000);
}
}
