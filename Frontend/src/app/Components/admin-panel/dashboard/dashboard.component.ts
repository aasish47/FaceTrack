import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

export interface acceptedRequests {
  Id: number;
  UserId: string;
  Name: string;
  Email: string;
  Date: string;
  Type: string;
  Reason: string;
  Status: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  presentEmployees: number = 0;
  absentEmployees: number = 0;
  lateEmployees: number = 0;
  wfhCorporateVisit: number = 0;
  totalEmployees: number = 0;


  today: Date = new Date();
  selectedDate: string = this.formatDate(this.today);
  startDate: string = this.formatDate(this.today);
  endDate: string = this.formatDate(this.today);


  selectedCategory: string = '';
  filteredUsers: any[] = [];
  positionTop: number = 0;
  positionLeft: number = 0;


  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  private chart: any;


  private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
  private monthlyApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';
  private apiUrl2 = 'http://localhost:8000/api/past-attendance-requests/';

  acceptedRequests: acceptedRequests[] = [];
  pastAttendanceRequestAccepted: number = 0;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('adminLoggedIn')) {
      this.router.navigate(['/login']);
    }
    this.loadAttendanceData();
    this.loadMonthlyAttendanceData();
    this.loadAcceptedRequests();
  }

  ngAfterViewInit() {
    this.loadChart([], [], []);
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
      this.totalEmployees = data.total_users.length;
      this.lateEmployees = data.late_users.length;
      this.presentEmployees = data.on_time_users.length;
      this.absentEmployees = data.absent_users.length;
      this.wfhCorporateVisit = this.pastAttendanceRequestAccepted;
    });
  }

  loadAcceptedRequests(): void {
    this.http.get<acceptedRequests[]>(this.apiUrl2).subscribe({
      next: (data: acceptedRequests[]) => {
        this.acceptedRequests = data.filter(request => request.Status === "Accepted");
        this.pastAttendanceRequestAccepted = this.acceptedRequests.length;
      },
      error: (error) => {
        console.error('Error fetching past attendance requests', error);
      }
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
      switch (category) {
        case 'total':
          this.filteredUsers = response.total_users;
          break;
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
          // the wfh logic is not yet added , it will be added on or before 6th of april
          this.filteredUsers = this.acceptedRequests;
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


  // Add these methods to your component class
  exportRegisteredUsers() {
    const url = 'http://localhost:8000/Registration/user/';
    this.http.get<any[]>(url).subscribe(users => {
      this.exportToExcel(users, 'Registered_Users');
    });
  }

  exportDailyAttendance() {
    if (!this.selectedDate) {
      alert('Please select a date first');
      return;
    }

    const url = `${this.apiUrl}?date=${this.selectedDate}`;
    this.http.get<any>(url).subscribe(data => {
      // Combine all attendance data into one array
      const attendanceData = [
        ...data.on_time_users.map((user: any) => ({ ...user, Status: 'On Time' })),
        ...data.late_users.map((user: any) => ({ ...user, Status: 'Late' })),
        ...data.absent_users.map((user: any) => ({ ...user, Status: 'Absent' }))
      ];

      this.exportToExcel(attendanceData, `Daily_Attendance_${this.selectedDate}`);
    });
  }

  exportAttendanceTrends() {
    if (!this.startDate || !this.endDate) {
      alert('Please select a date range first');
      return;
    }

    const url = `${this.monthlyApiUrl}?start_date=${this.startDate}&end_date=${this.endDate}`;
    this.http.get<any[]>(url).subscribe(data => {
      // Format trend data for export
      const trendData = data.map(item => ({
        Date: item.date,
        Present: item.present,
        Absent: item.absent,
        Percentage: (item.present / (item.present + item.absent) * 100).toFixed(2) + '%'
      }));

      this.exportToExcel(trendData, `Attendance_Trends_${this.startDate}_to_${this.endDate}`);
    });
  }

  private exportToExcel(data: any[], fileName: string) {
    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate file and download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

}