import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  user = {
    name: 'Tony Stark',
    email: 'Ironman@marvel.com',
    role: 'Manager'
  };

  // Define chart data
  attendanceData = [
    { data: [80, 90, 75, 95, 85], label: 'Attendance' }
  ];

  attendanceLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { ticks: { font: { size: 14 } } },
      y: { ticks: { font: { size: 14 } } }
    }
  };

  recentLogs = [
    'Logged in at 8:45 AM',
    'Timed out for lunch at 2:00 PM',
    'Timed in after lunch at 2:45 PM',
    'Logged out at 4:45 PM'
  ];

  notifications = [
    'Your attendance is above 85%',
    'New schedule updated for next week',
    'Holiday announced on Friday'
  ];

  updateProfile() {
    alert('Update Profile Clicked');
  }

  changePassword() {
    alert('Change Password Clicked');
  }
}
