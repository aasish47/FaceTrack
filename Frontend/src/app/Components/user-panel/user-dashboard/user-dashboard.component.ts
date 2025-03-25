import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment?: string;
  userDesignation?: string;
  userPhoto?: string;
}

interface AttendanceRecord {
  date: string;
  time_in: string;
  time_out: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user: User = { userId: '', userName: '', userEmail: '', userDepartment: '', userDesignation: '', userPhoto: '' };
  editProfileForm: FormGroup;
  isEditing: boolean = false;

  attendanceData: { data: number[]; label: string }[] = [];
  attendanceLabels: string[] = [];
  recentLogs: string[] = [];

  notifications: string[] = [
    'Your attendance is above 85%',
    'New schedule updated for next week',
    'Holiday announced on Friday'
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.editProfileForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userDepartment: ['', Validators.required],
      userDesignation: ['', Validators.required]
    });
  }

  ngOnInit() {
    const userId = 1; // Replace with dynamic user ID

    // Fetch User Details
    this.userService.getUserDetails(userId).subscribe((data: User) => {
      this.user = { ...data };

      // Convert Base64 string to an image URL
      if (this.user.userPhoto) {
        this.user.userPhoto = `data:image/jpeg;base64,${this.user.userPhoto}`;
      }

      this.editProfileForm.patchValue({
        userName: data.userName,
        userEmail: data.userEmail,
        userDepartment: data.userDepartment,
        userDesignation: data.userDesignation
      });
    });

    // Fetch Attendance Data
    this.userService.getUserAttendance(userId).subscribe((data: AttendanceRecord[]) => {
      const recentData = data.slice(-5); // Get last 5 records

      this.attendanceData = [
        { 
          data: recentData.map((item) => this.calculateAttendancePercentage(item)), 
          label: 'Attendance' 
        }
      ];
      this.attendanceLabels = recentData.map((item) => item.date);

      this.recentLogs = recentData.map(
        (item) => `Date: ${item.date} | Logged in at ${item.time_in}, Logged out at ${item.time_out}`
      );
    });
  }

  calculateAttendancePercentage(attendance: AttendanceRecord): number {
    return 100;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editProfileForm.patchValue({
        userName: this.user.userName,
        userEmail: this.user.userEmail,
        userDepartment: this.user.userDepartment,
        userDesignation: this.user.userDesignation
      });
    }
  }

  saveProfile() {
    if (this.editProfileForm.valid) {
      this.user = { ...this.user, ...this.editProfileForm.value };
      this.isEditing = false;
      console.log('Profile Updated:', this.user);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updateProfile() {}
  changePassword() {}
}
