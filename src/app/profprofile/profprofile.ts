import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Data } from '../../app/services/data'; // تأكد من المسار الصحيح للسيرفس
import { Course, DoctorProfile } from '../../app/models/data.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profprofile.html',
  styleUrls: ['./profprofile.css']
})
export class Profprofile implements OnInit {
  doctor!: DoctorProfile;
  assignedCourses: Course[] = [];

  // نموذج بيانات كلمة المرور
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(private dataService: Data) {}

  ngOnInit(): void {
    this.doctor = this.dataService.getDoctorProfile();
    this.assignedCourses = this.dataService.getCourses();
  }

  changePassword() {
    // التحقق من تطابق كلمة المرور
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }

    // استدعاء السيرفس لتحديث كلمة المرور
    this.dataService.updatePassword(this.passwordData.current, this.passwordData.new)
      .subscribe(success => {
        if (success) {
          alert('Password updated successfully!');
          // تصفير الفورم
          this.passwordData = { current: '', new: '', confirm: '' };
        }
      });
  }
}
