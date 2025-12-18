import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth.service';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, RouterLink, Navbar],
  styleUrls: ['./login.css']
})
export class Login {
    loginForm: FormGroup;
    errorMessage: string | null = null;

     constructor(
       private fb: FormBuilder,
       private authService: Auth,
       private router: Router
     ) {
       this.loginForm = this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required]
       });
     }

     onSubmit() {
       if (this.loginForm.valid) {
         const { email, password } = this.loginForm.value;
         this.authService.login(email, password).subscribe({
           next: (response) => {
             const userType = response.user.userType;
            //  this.router.navigate([userType === 'student' ? '/student-dashboard' : '/professor-dashboard']);
           },
           error: (err) => {
             this.errorMessage = err.message; // Display error in UI
           }
         });
       }
     }
}
