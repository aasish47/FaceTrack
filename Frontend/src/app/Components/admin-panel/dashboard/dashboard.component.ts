import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  presentStudents: number = 0;
  absentStudents: number = 0;
  lateStudents: number = 0;
  wfhCorporateVisit: number = 0;
  totalStudents: number = 0;
  selectedDate: string = new Date().toISOString().split('T')[0];

  selectedCategory: string = '';
  filteredUsers: any[] = [];
  positionTop: number = 0;
  positionLeft: number = 0;

  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];

  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  private chart: any;

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
  }

  loadAttendanceData() {
    const url = `${this.apiUrl}?date=${this.selectedDate}`;
    this.http.get<any>(url).subscribe(data => {
      console.log(data);
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

      console.log(presentData);
      console.log(absentData);

      this.loadChart(labels, presentData, absentData);
    });
  }

  fetchUsers(category: string, card: HTMLElement) {
    this.selectedCategory = category;

    const url = `http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/?date=${this.selectedDate}`;
    this.http.get<any>(url).subscribe(response => {
      if (category === 'onTime') {
        this.filteredUsers = response.on_time_users;
      } else if (category === 'late') {
        this.filteredUsers = response.late_users;
      } else if (category === 'absent') {
        this.filteredUsers = response.absent_users;
      } else if (category === 'present') {
        this.filteredUsers = [...response.on_time_users, ...response.late_users];
      } else if (category === 'wfhCorporateVisit') {
        this.filteredUsers = [];
      } else {
        this.filteredUsers = [];
      }

      // Get the position of the clicked card to display the floating card
      const rect = card.getBoundingClientRect();
      this.positionTop = rect.top + window.scrollY;
      this.positionLeft = rect.left + window.scrollX;

      console.log("Filtered Users:", this.filteredUsers);
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

      console.log("Date Range Data:", data);
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
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
