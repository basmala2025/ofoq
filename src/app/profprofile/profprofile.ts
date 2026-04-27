import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Course, DoctorProfile } from '../../app/models/data.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profprofile.html',
  styleUrls: ['./profprofile.css']
})
export class Profprofile implements OnInit {
  doctorData: any;
  doctor!: DoctorProfile;
  assignedCourses: Course[] = [];
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(private auth: AuthService) {}

 ngOnInit() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.id || currentUser.userId;

  if (userId) {
    this.auth.getDoctorProfile(userId).subscribe({
      next: (profileData) => {
        console.log('بيانات الدكتور اهي:', profileData);
        // هنا تقدري تملي الفورم ببيانات الدكتور
        this.doctorData = profileData;
      },
      error: (err) => console.error('فشل جلب بيانات البروفايل', err)
    });
  }
}

  changePassword() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }

    this.auth.updatePassword(this.passwordData.current, this.passwordData.new)
      .subscribe(success => {
        if (success) {
          alert('Password updated successfully!');
          this.passwordData = { current: '', new: '', confirm: '' };
        }
      });
  }
}
