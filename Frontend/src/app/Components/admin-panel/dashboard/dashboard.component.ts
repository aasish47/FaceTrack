// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Chart } from 'chart.js';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {

//   totalStudents: number = 0;
//   presentStudents: number = 0;
//   absentStudents: number = 0;
//   lateStudents: number = 0;

//   @ViewChild('attendanceChart') attendanceChart!: ElementRef;
//   private chart: any;

//   private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';

//   constructor(private http: HttpClient, private router: Router) { }

//   ngOnInit() {
//     if(!localStorage.getItem('adminLoggedIn')){
//       this.router.navigate(['/login']);
//     }
//     this.loadAttendanceData();
//   }

//   ngAfterViewInit() {
//     this.loadChart();
//   }

//   loadAttendanceData() {
//     this.http.get<any>(this.apiUrl).subscribe(data => {
//       this.totalStudents = data.total_strength;
//       this.lateStudents = data.late_count;
//       this.presentStudents = data.on_time_count;
//       this.absentStudents = this.totalStudents - data.total_people_today;

//       this.loadChart(); // Reload chart after data load
//     });
//   }

//   loadChart() {
//     if (this.chart) {
//       this.chart.destroy(); // Destroy existing chart to avoid duplication
//     }

//     this.chart = new Chart(this.attendanceChart.nativeElement, {
//       type: 'bar',
//       data: {
//         labels: ['Present', 'Absent', 'Late'],
//         datasets: [{
//           label: 'Attendance Chart',
//           data: [this.presentStudents, this.absentStudents, this.lateStudents],
//           backgroundColor: ['#28a745', '#dc3545', '#ffc107']
//         }]
//       }
//     });
//   }
// }



// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Chart } from 'chart.js';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
  
//   presentStudents: number = 0;
//   absentStudents: number = 0;
//   lateStudents: number = 0;
//   wfhCorporateVisit: number = 0; // New Field
//   selectedDate: string = new Date().toISOString().split('T')[0]; // Default to today

//   @ViewChild('attendanceChart') attendanceChart!: ElementRef;
//   private chart: any;

//   private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//     if (!localStorage.getItem('adminLoggedIn')) {
//       this.router.navigate(['/login']);
//     }
//     this.loadAttendanceData();
//   }

//   ngAfterViewInit() {
//     this.loadChart();
//   }

//   loadAttendanceData() {
//     const url = `${this.apiUrl}?date=${this.selectedDate}`;
//     this.http.get<any>(url).subscribe(data => {
//       this.lateStudents = data.late_users.length;
//       this.presentStudents = data.on_time_users.length;
//       this.absentStudents = data.absent_users.length;
//       this.wfhCorporateVisit = data.wfh_corporate_visit.length; // Fetch WFH/Corporate Visit count

//       this.loadChart(); // Reload chart after data load
//     });
//   }

//   loadChart() {
//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(this.attendanceChart.nativeElement, {
//       type: 'bar',
//       data: {
//         labels: ['Present', 'Absent', 'Late', 'WFH/Corporate Visit'],
//         datasets: [{
//           label: 'Attendance Chart',
//           data: [this.presentStudents, this.absentStudents, this.lateStudents, this.wfhCorporateVisit],
//           backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#6c757d']
//         }]
//       }
//     });
//   }
// }










// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Chart } from 'chart.js';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
  
//   presentStudents: number = 0;
//   absentStudents: number = 0;
//   lateStudents: number = 0;
//   wfhCorporateVisit: number = 0;
//   selectedDate: string = new Date().toISOString().split('T')[0];

//   @ViewChild('attendanceChart') attendanceChart!: ElementRef;
//   private chart: any;

//   private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
//   private monthlyApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//     if (!localStorage.getItem('adminLoggedIn')) {
//       this.router.navigate(['/login']);
//     }
//     this.loadAttendanceData();
//     this.loadMonthlyAttendanceData(); // Load trend data
//   }

//   ngAfterViewInit() {
//     this.loadChart([]);
//   }

//   loadAttendanceData() {
//     const url = `${this.apiUrl}?date=${this.selectedDate}`;
//     this.http.get<any>(url).subscribe(data => {
//       this.lateStudents = data.late_users.length;
//       this.presentStudents = data.on_time_users.length;
//       this.absentStudents = data.absent_users.length;
//       this.wfhCorporateVisit = data.wfh_corporate_visit.length;
//     });
//   }

//   loadMonthlyAttendanceData() {
//     this.http.get<any>(this.monthlyApiUrl).subscribe(data => {
//       const labels = data.map((item: any) => item.date);
//       const presentData = data.map((item: any) => item.present);
//       const absentData = data.map((item: any) => item.absent);

//       this.loadChart(labels, presentData, absentData);
//     });
//   }

//   loadChart(labels: string[], presentData: number[] = [], absentData: number[] = []) {
//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(this.attendanceChart.nativeElement, {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Present',
//             data: presentData,
//             borderColor: '#28a745',
//             fill: false,
//             tension: 0.3
//           },
//           {
//             label: 'Absent',
//             data: absentData,
//             borderColor: '#dc3545',
//             fill: false,
//             tension: 0.3
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }
// }








// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Chart } from 'chart.js';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
  
//   presentStudents: number = 0;
//   absentStudents: number = 0;
//   lateStudents: number = 0;
//   wfhCorporateVisit: number = 0;
//   selectedDate: string = new Date().toISOString().split('T')[0];

//   selectedCategory: string = '';
//   filteredUsers: any[] = [];

//   @ViewChild('attendanceChart') attendanceChart!: ElementRef;
//   private chart: any;

//   private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
//   private usersApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-users/';
//   private monthlyApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//     if (!localStorage.getItem('adminLoggedIn')) {
//       this.router.navigate(['/login']);
//     }
//     this.loadAttendanceData();
//     this.loadMonthlyAttendanceData();
//   }

//   ngAfterViewInit() {
//     this.loadChart([], [], []);
//   }

//   loadAttendanceData() {
//     const url = `${this.apiUrl}?date=${this.selectedDate}`;
//     this.http.get<any>(url).subscribe(data => {
//       this.lateStudents = data.late_users.length;
//       this.presentStudents = data.on_time_users.length;
//       this.absentStudents = data.absent_users.length;
//       this.wfhCorporateVisit = data.wfh_corporate_visit.length;
//     });
//   }

//   loadMonthlyAttendanceData() {
//     this.http.get<any>(this.monthlyApiUrl).subscribe(data => {
//       const labels = data.map((item: any) => item.date);
//       const presentData = data.map((item: any) => item.present);
//       const absentData = data.map((item: any) => item.absent);

//       this.loadChart(labels, presentData, absentData);
//     });
//   }

//   fetchUsers(category: string) {
//     this.selectedCategory = category;
  
//     const url = `http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/?date=${this.selectedDate}`;
//     this.http.get<any>(url).subscribe(response => {
//       if (category === 'onTime') {
//         this.filteredUsers = response.on_time_users;
//       } else if (category === 'late') {
//         this.filteredUsers = response.late_users;
//       } else if (category === 'absent') {
//         this.filteredUsers = response.absent_users;
//       } else if (category === 'present') {  // Add case for present
//         this.filteredUsers = response.present_users;  // Fetch both late and on-time users
//       } else {
//         this.filteredUsers = [];
//       }
  
//       console.log("Filtered Users:", this.filteredUsers);
//     });
//   }

//   loadChart(labels: string[], presentData: number[], absentData: number[]) {
//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(this.attendanceChart.nativeElement, {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Present',
//             data: presentData,
//             borderColor: '#28a745',
//             fill: false,
//             tension: 0.3
//           },
//           {
//             label: 'Absent',
//             data: absentData,
//             borderColor: '#dc3545',
//             fill: false,
//             tension: 0.3
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }
// }






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
  selectedDate: string = new Date().toISOString().split('T')[0];

  selectedCategory: string = '';
  filteredUsers: any[] = [];
  positionTop: number = 0;
  positionLeft: number = 0;

  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  private chart: any;

  private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
  private usersApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-users/';
  private monthlyApiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';

  constructor(private http: HttpClient, private router: Router) {}

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
      this.lateStudents = data.late_users.length;
      this.presentStudents = data.on_time_users.length;
      this.absentStudents = data.absent_users.length;
      this.wfhCorporateVisit = data.wfh_corporate_visit.length;
    });
  }

  loadMonthlyAttendanceData() {
    this.http.get<any>(this.monthlyApiUrl).subscribe(data => {
      const labels = data.map((item: any) => item.date);
      const presentData = data.map((item: any) => item.present);
      const absentData = data.map((item: any) => item.absent);

      console.log(presentData);
      console.log(absentData)

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
        this.filteredUsers = [...response.on_time_users, ...response.late_users]; // Fetch both present and late users
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