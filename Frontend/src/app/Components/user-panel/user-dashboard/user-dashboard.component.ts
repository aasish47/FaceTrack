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
      const groupedByDate: { [key: string]: { time_in: string[]; time_out: string[] } } = {};

      data.forEach(record => {
        if (!groupedByDate[record.date]) {
          groupedByDate[record.date] = { time_in: [], time_out: [] };
        }
        groupedByDate[record.date].time_in.push(record.time_in);
        groupedByDate[record.date].time_out.push(record.time_out);
      });

      const lastFiveDays = Object.keys(groupedByDate).slice(-5);
      this.attendanceData = [
        {
          data: lastFiveDays.map(date => this.calculateTotalHours(groupedByDate[date].time_in, groupedByDate[date].time_out)),
          label: 'Hours Worked'
        }
      ];
      this.attendanceLabels = lastFiveDays;

      const lastThreeLogs = data.slice(-3).map(item => {
        return `Date: ${item.date} | Logged in at ${item.time_in}, Logged out at ${item.time_out}`;
      });

      this.recentLogs = lastThreeLogs;
    });
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    return (totalTimeOut - totalTimeIn) / (1000 * 60 * 60);
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
  




  // Add to your component class
today = new Date();

chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: number) {
          return value + ' hrs';
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

// Helper methods for recent logs
extractDate(log: string): string {
  return log.split('|')[0].replace('Date:', '').trim();
}

extractTimeIn(log: string): string {
  return log.split('|')[1].split(',')[0].replace('Logged in at', '').trim();
}

extractTimeOut(log: string): string {
  return log.split('|')[1].split(',')[1].replace('Logged out at', '').trim();
}

calculateDuration(log: string): string {
  const timeIn = this.extractTimeIn(log);
  const timeOut = this.extractTimeOut(log);
  if (timeIn && timeOut) {
    // Add your duration calculation logic here
    return '8h 15m'; // Example
  }
  return '--';
}
}


