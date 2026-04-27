import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Navbar,
    HttpClientModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Signup implements OnInit {
  // --- Component State Signals ---
  signupForm!: FormGroup;
  isLoading = false;
  isInvited = signal(false);
  pageTitle = signal('Create Account');

  /**
   * invitationToken: Stores the security key received from the email link.
   * This is crucial for verifying academic invitations (Professors/Admins).
   */
  invitationToken = signal<string | null>(null);

  // --- Dependency Injection ---
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // --- API Configuration ---
  private readonly apiUrl = 'https://ofoqai.runasp.net/api/Auth/register';

  ngOnInit(): void {
    // Initialize the reactive form with validation rules
    this.initForm();

    // Monitor URL parameters for invitation data (token, email, role)
    this.handleInvitationParams();
  }

  /**
   * Initializes the form structure and default values.
   */
  private initForm() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      id: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: [0] // Default role is Student (0)
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Extracts parameters from the invitation URL.
   * Format: /#/signup?token=xxx&email=yyy&role=z
   */
  private handleInvitationParams() {
    this.route.queryParams.subscribe(params => {
      const tokenParam = params['token'];
      const emailParam = params['email'];
      const roleParam = params['role'];

      if (tokenParam) {
        console.log('Invitation detected. Security token captured.');

        this.invitationToken.set(tokenParam); // Store the token for submission
        this.isInvited.set(true);
        this.pageTitle.set('Activate Academic Account');

        // Auto-fill form and lock the email/role fields via UI logic
        this.signupForm.patchValue({
          email: emailParam,
          role: roleParam ? parseInt(roleParam) : 0
        });
      }
    });
  }

  /**
   * Validator to ensure password consistency.
   */
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  /**
   * Prepares the final payload and calls the Register API.
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;

      // Preparing the request body including the invitation token
      const payload = {
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword,
        academicId: this.signupForm.value.id,
        role: this.signupForm.value.role,
        /** * Important: Sending the captured token back to the server
         * to authorize the registration of special roles.
         */
        token: this.invitationToken()
      };

      this.http.post(this.apiUrl, payload).subscribe({
        next: (res: any) => {
          // Store session info locally
          localStorage.setItem('userToken', res.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', payload.role.toString());

          // Role-Based Routing Logic
          let targetRoute = '';
          if (payload.role === 0) {
            targetRoute = '/dashboardstudent';
          } else if (payload.role === 2) {
            targetRoute = '/dashboard';
          } else if (payload.role === 3) {
            targetRoute = '/admin-dashboard';
          } else {
            targetRoute = '/home';
          }

          console.log(`Success! Navigating to: ${targetRoute}`);
          this.router.navigate([targetRoute], { replaceUrl: true });
        },
        error: (err: any) => {
          console.error('Registration API Error:', err);
          // If the token is invalid, the backend should return a detail message
          const errorMessage = err.error?.detail || 'Registration failed. The link may have expired.';
          alert(errorMessage);
          this.isLoading = false;
        }
      });
    }
  }
}
