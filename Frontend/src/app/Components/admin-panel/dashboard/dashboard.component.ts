import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Attendance Data
  presentStudents: number = 0;
  absentStudents: number = 0;
  lateStudents: number = 0;
  wfhCorporateVisit: number = 0;
  totalStudents: number = 0;
  
  // Date Handling
  today: Date = new Date();
  selectedDate: string = this.formatDate(this.today);
  startDate: string = this.formatDate(this.today);
  endDate: string = this.formatDate(this.today);
  
  // User List
  selectedCategory: string = '';
  filteredUsers: any[] = [];
  positionTop: number = 0;
  positionLeft: number = 0;

  // Chart References
  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  private chart: any;

  // API Endpoints
  private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
  private usersApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-users/';
  private monthlyApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('adminLoggedIn')) {
      this.router.navigate(['/login']);
    }
    this.loadAttendanceData();
    this.loadMonthlyAttendanceData();
  }

  ngAfterViewInit() {
    this.loadChart([], [], []);
    // this.loadDepartmentChart();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  loadAttendanceData() {
    const url = `${this.apiUrl}?date=${this.selectedDate}`;
    this.http.get<any>(url).subscribe(data => {
      this.totalStudents = data.total_strength;
      this.lateStudents = data.late_users.length;
      this.presentStudents = data.on_time_users.length;
      this.absentStudents = data.absent_users.length;
      this.wfhCorporateVisit = data.wfh_corporate_visit;
    });
  }

  loadMonthlyAttendanceData() {
    this.http.get<any>(this.monthlyApiUrl).subscribe(data => {
      const labels = data.map((item: any) => item.date);
      const presentData = data.map((item: any) => item.present);
      const absentData = data.map((item: any) => item.absent);

      this.loadChart(labels, presentData, absentData);
    });
  }

  fetchUsers(category: string, card?: HTMLElement) {
    this.selectedCategory = category;

    const url = `${this.apiUrl}?date=${this.selectedDate}`;
    this.http.get<any>(url).subscribe(response => {
      switch(category) {
        case 'onTime':
          this.filteredUsers = response.on_time_users;
          break;
        case 'late':
          this.filteredUsers = response.late_users;
          break;
        case 'absent':
          this.filteredUsers = response.absent_users;
          break;
        case 'present':
          this.filteredUsers = [...response.on_time_users, ...response.late_users];
          break;
        case 'wfhCorporate':
          this.filteredUsers = []; // Add your WFH users logic here
          break;
        default:
          this.filteredUsers = [];
      }

      if (card) {
        const rect = card.getBoundingClientRect();
        this.positionTop = rect.top + window.scrollY;
        this.positionLeft = rect.left + window.scrollX;
      }
    });
  }

  closeUserList() {
    this.filteredUsers = [];
  }

  loadAttendanceBetweenDates() {
    if (!this.startDate || !this.endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const url = `${this.monthlyApiUrl}?start_date=${this.startDate}&end_date=${this.endDate}`;
    this.http.get<any>(url).subscribe(data => {
      const labels = data.map((item: any) => item.date);
      const presentData = data.map((item: any) => item.present);
      const absentData = data.map((item: any) => item.absent);

      this.loadChart(labels, presentData, absentData);
    });
  }

  loadChart(labels: string[], presentData: number[], absentData: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.attendanceChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Present',
            data: presentData,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Absent',
            data: absentData,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Employees'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  }

}