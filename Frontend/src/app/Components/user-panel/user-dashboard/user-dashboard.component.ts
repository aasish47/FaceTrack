import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

interface User {
  fullname: string;
  email: string;
  designation?: string;
  name?: string; 
  role?: string; 
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
  user: User = { fullname: '', email: '', designation: 'User' };
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
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required]
    });
  }

  ngOnInit() {
    const userId = 1; // Replace with dynamic user ID

    // Fetch User Details
    this.userService.getUserDetails(userId).subscribe((data: User) => {
      this.user = {
        fullname: data.fullname,
        email: `${data.fullname.toLowerCase().replace(' ', '.')}@example.com`, // Mock email
        designation: data.designation || 'User',
        name: data.fullname, 
        role: data.designation 
      };
      this.editProfileForm.patchValue(this.user);
    });

    // Fetch Attendance Data
    this.userService.getUserAttendance(userId).subscribe((data: AttendanceRecord[]) => {
      this.attendanceData = [{ data: data.map((item) => this.calculateAttendancePercentage(item)), label: 'Attendance' }];
      this.attendanceLabels = data.map((item) => item.date);
      this.recentLogs = data.map((item) => `Logged in at ${item.time_in}, Logged out at ${item.time_out}`);
    });
  }

  calculateAttendancePercentage(attendance: AttendanceRecord): number {
    return 100; 
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editProfileForm.patchValue(this.user);
    }
  }

  saveProfile() {
    if (this.editProfileForm.valid) {
      this.user = { ...this.editProfileForm.value };
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
