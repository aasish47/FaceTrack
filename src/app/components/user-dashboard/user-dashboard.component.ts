import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import  Chart  from 'chart.js/auto';

// Define interfaces for type safety
interface User {
  name: string;
  id: string;
  role: string;
  department: string;
}

interface Attendance {
  present: number;
  absent: number;
  late: number;
}

interface Log {
  date: string;
  status: string;
  time: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements AfterViewInit {
  activeSection: string = 'dashboard';
  attendanceChart: any;
  attendancePieChart: any;

  constructor(private router: Router) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderAttendancePieChart();
      this.renderAttendanceChart();
    },100);
  }

  ngOnInit() {

    if (localStorage.getItem('userLoggedIn')!= 'true'){
      this.router.navigate(['/user-login']);
    }
  }

  renderAttendancePieChart() {
    const canvas = document.getElementById('attendancePieChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (this.attendancePieChart) this.attendancePieChart.destroy();

      this.attendancePieChart = new Chart(ctx!, {
        type: 'pie',
        data: {
          labels: ['Present', 'Absent', 'Late'],
          datasets: [{
            data: [this.attendance.present, this.attendance.absent, this.attendance.late],
            backgroundColor: ['#28a745', '#dc3545', '#ffc107']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  renderAttendanceChart() {
    const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (this.attendanceChart) this.attendanceChart.destroy();

      this.attendanceChart = new Chart(ctx!, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'Attendance',
            data: [20, 18, 22, 19, 24, 21],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  // Sample User Data
  user: User = {
    name: "Alice Smith",
    id: "EMP456",
    role: "Project Manager",
    department: "Operations"
  };

  // Sample Attendance Summary
  attendance: Attendance = {
    present: 22,
    absent: 2,
    late: 1
  };

  // Sample Logs
  logs: Log[] = [
    { date: "2025-02-01", status: "Present", time: "08:45 AM" },
    { date: "2025-02-02", status: "Present", time: "08:50 AM" },
    { date: "2025-02-03", status: "Late", time: "09:15 AM" },
    { date: "2025-02-04", status: "Absent", time: "N/A" },
    { date: "2025-02-05", status: "Present", time: "08:55 AM" }
  ];


  // Method to handle user logout
  logout() {
    localStorage.removeItem('userLoggedIn');
    this.router.navigate(['/user-login']);
  }

  // Method to switch between dashboard sections
  showSection(section: string) {
    this.activeSection = section;
    setTimeout(() => {
      if(section === 'dashboard'){
        this.renderAttendancePieChart();
        this.renderAttendanceChart();
      }
    },100);
  }

  fetchUserData() {
    // Implement API call to fetch user data
  }

  fetchAttendanceData() {
    // Implement API call to fetch attendance data
  }

  fetchLogs() {
    // Implement API call to fetch logs
  }
}
