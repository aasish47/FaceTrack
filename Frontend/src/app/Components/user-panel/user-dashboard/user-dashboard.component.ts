import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.editProfileForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userDepartment: ['', Validators.required],
      userDesignation: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (!localStorage.getItem('userLoggedIn')) {
      this.router.navigate(['/login']);
    }

    const userId = Number(sessionStorage.getItem('userId'));

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
      const lastFive = data.slice(-5); // Get last 5 records (including partial)
  
      this.attendanceData = [
        {
          data: lastFive.map(item => this.calculateLoggedHours(item)),
          label: 'Logged Hours'
        }
      ];
  
      this.attendanceLabels = lastFive.map(item => item.date);
  
      this.recentLogs = lastFive.map(item => {
        if (item.time_in !== '00:00:00' && item.time_out === '00:00:00') {
          return `Date: ${item.date} | Logged in at ${item.time_in}`;
        } else if (item.time_in === '00:00:00' && item.time_out !== '00:00:00') {
          return `Date: ${item.date} | Logged out at ${item.time_out}`;
        } else if (item.time_in !== '00:00:00' && item.time_out !== '00:00:00') {
          return `Date: ${item.date} | Logged in at ${item.time_in}, Logged out at ${item.time_out}`;
        } else {
          return `Date: ${item.date} | No login or logout data`;
        }
      });
    });
  }

  calculateLoggedHours(item: AttendanceRecord): number {
    if (item.time_in === '00:00:00' || item.time_out === '00:00:00') {
      return 0; // Don't calculate if incomplete data
    }
    const timeIn = new Date(`1970-01-01T${item.time_in}`);
    const timeOut = new Date(`1970-01-01T${item.time_out}`);
    const diffInMs = timeOut.getTime() - timeIn.getTime();
    return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
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

  updateProfile() { }

  changePassword() { }
}
