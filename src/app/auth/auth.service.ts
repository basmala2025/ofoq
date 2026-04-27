import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { User } from '../models/data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://ofoqai.runasp.net/api';

  // Signals for user state management
  users = signal<User[]>([]);

  /**
   * Helper to construct authorization headers using the stored token
   */
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ================= USER PROFILE & MANAGEMENT =================

  /**
   * Fetches profile data for a specific user (Doctor or otherwise)
   * @param id The unique UserId
   */
  getDoctorProfile(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Users/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Fetches all users from the system (Admin access required)
   * Includes mapping logic to handle .NET JSON response structures ($values)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.baseUrl}/Users`, { headers: this.getHeaders() }).pipe(
      map(res => {
        // Handle cases where .NET wraps arrays in $values or data properties
        const usersArray = res.$values || res.data || res || [];
        return usersArray.map((u: any) => ({
          // Normalize user identifiers and properties based on API schema
          id: String(u.userId || u.id || u.Id || ''),
          name: u.fullName || u.name || 'Unknown',
          email: u.email,
          role: String(u.role),
          status: u.status
        }));
      }),
      tap(mapped => this.users.set(mapped))
    );
  }

  /**
   * Invites a new user to the platform
   * @param payload Object containing email and assigned role
   */
  inviteUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/invite`, payload, { headers: this.getHeaders() });
  }

  /**
   * Updates an existing user's information
   * @param payload Object containing updated fields and userId
   */
  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Users/${payload.userId}`, payload, { headers: this.getHeaders() });
  }

  /**
   * Deletes a user by ID and updates the local signal state
   * @param id The UserId to be removed
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Users/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        // Filter out the deleted user from the signal state
        this.users.update(all => all.filter(u => u.id !== id));
      })
    );
  }

  // ================= AUTHENTICATION =================

  /**
   * Updates the password for the current authenticated user
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    const body = { currentPassword, newPassword };
    return this.http.post(`${this.baseUrl}/Auth/change-password`, body, { headers: this.getHeaders() });
  }

  /**
   * Logs out the user by revoking the refresh token
   * @param payload Contains refreshToken and revokeAllDevices flag
   */
  logout(payload: { refreshToken: string | null; revokeAllDevices: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/logout`, payload, { headers: this.getHeaders() });
  }
}
