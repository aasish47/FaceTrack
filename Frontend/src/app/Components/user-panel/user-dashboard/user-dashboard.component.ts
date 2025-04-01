import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ChartData, ChartOptions } from 'chart.js';

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
  status?: 'present' | 'late' | 'absent';
}

interface Notification {
  id: number;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  user: User = { 
    userId: '', 
    userName: '', 
    userEmail: '', 
    userDepartment: '', 
    userDesignation: '', 
    userPhoto: '' 
  };


  editProfileForm: FormGroup;

  isUserPresent: boolean = false;
  today = new Date();
  recentLogs: AttendanceRecord[] = [];


  public attendanceChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Hours Worked',
        data: [],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 0.8)',
        fill: 'origin',
      }
    ]
  };

  public attendanceChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} hrs`
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} hrs`
        }
      }
    }
  };

  
  notifications: Notification[] = [
    {
      id: 1,
      message: 'Your attendance is above 85%',
      time: '2 hours ago',
      priority: 'low',
      read: false
    },
    {
      id: 2,
      message: 'New schedule updated for next week',
      time: '1 day ago',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      message: 'Holiday announced on Friday',
      time: '3 days ago',
      priority: 'high',
      read: true
    }
  ];

  
  stats = {
    monthlyAverage: '95%',
    daysPresent: '28/30'
  };

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ) {
    this.editProfileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userDepartment: ['', Validators.required],
      userDesignation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserData();
    this.loadAttendanceData();
  }

  // Formatting helpers
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  calculateDuration(log: AttendanceRecord): string {
    if (!log.time_in || !log.time_out) return '--';
    
    const timeIn = new Date(`1970-01-01T${log.time_in}Z`).getTime();
    const timeOut = new Date(`1970-01-01T${log.time_out}Z`).getTime();
    const durationMs = timeOut - timeIn;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }


  private checkAuthentication() {
    if (!localStorage.getItem('userLoggedIn')) {
      this.router.navigate(['/login']);
    }
  }

  private loadUserData() {
    const userId = Number(sessionStorage.getItem('userId'));
    
    this.userService.getUserDetails(userId).subscribe({
      next: (data: User) => {
        this.user = { ...data };
        
        if (this.user.userPhoto) {
          this.user.userPhoto = `data:image/jpeg;base64,${this.user.userPhoto}`;
        } else {
          this.user.userPhoto = 'assets/default-user.png';
        }

        this.editProfileForm.patchValue({
          userName: data.userName,
          userEmail: data.userEmail,
          userDepartment: data.userDepartment,
          userDesignation: data.userDesignation
        });
      },
      error: (err) => {
        console.error('Error loading user data:', err);
      }
    });
  }

  private loadAttendanceData() {
    const userId = Number(sessionStorage.getItem('userId'));
    
    this.userService.getUserAttendance(userId).subscribe({
      next: (data: AttendanceRecord[]) => {
        this.processAttendanceData(data);
        this.checkCurrentAttendanceStatus(data);
        this.prepareRecentLogs(data);
      },
      error: (err) => {
        console.error('Error loading attendance data:', err);
      }
    });
  }

  private processAttendanceData(data: AttendanceRecord[]) {
    const groupedByDate: { [key: string]: { time_in: string[]; time_out: string[] } } = {};

    data.forEach(record => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = { time_in: [], time_out: [] };
      }
      groupedByDate[record.date].time_in.push(record.time_in);
      groupedByDate[record.date].time_out.push(record.time_out);
    });

    const dates = Object.keys(groupedByDate).slice(-7);
    this.attendanceChartData = {
      ...this.attendanceChartData,
      labels: dates,
      datasets: [
        {
          ...this.attendanceChartData.datasets[0],
          data: dates.map(date => 
            this.calculateTotalHours(groupedByDate[date].time_in, groupedByDate[date].time_out)
          )
        }
      ]
    };
  }

  private prepareRecentLogs(data: AttendanceRecord[]) {
    this.recentLogs = data.slice(-5).reverse();
  }

  private checkCurrentAttendanceStatus(data: AttendanceRecord[]) {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = data.find(record => record.date === today);
    this.isUserPresent = !!todayRecord && !!todayRecord.time_in;
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    
    const lastTimeIn = timeIns[timeIns.length - 1];
    const lastTimeOut = timeOuts[timeOuts.length - 1] || '00:00:00';
    
    const timeInMs = new Date(`1970-01-01T${lastTimeIn}Z`).getTime();
    const timeOutMs = new Date(`1970-01-01T${lastTimeOut}Z`).getTime();
    
    return parseFloat(((timeOutMs - timeInMs) / (1000 * 60 * 60)).toFixed(2));
  }

  openAttendanceModal() {
    const modal = new bootstrap.Modal(document.getElementById('attendanceModal')!);
    modal.show();
  }

  closeAttendanceModal() {
    const modalElement = document.getElementById('attendanceModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}