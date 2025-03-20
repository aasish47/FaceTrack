import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  totalStudents: number = 0;
  presentStudents: number = 0;
  absentStudents: number = 0;
  lateStudents: number = 0;

  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  private chart: any;

  private apiUrl = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAttendanceData();
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadAttendanceData() {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      this.totalStudents = data.total_strength;
      this.lateStudents = data.late_count;
      this.presentStudents = data.on_time_count;
      this.absentStudents = this.totalStudents - data.total_people_today;

      this.loadChart(); // Reload chart after data load
    });
  }

  loadChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart to avoid duplication
    }

    this.chart = new Chart(this.attendanceChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Present', 'Absent', 'Late'],
        datasets: [{
          label: 'Attendance Chart',
          data: [this.presentStudents, this.absentStudents, this.lateStudents],
          backgroundColor: ['#28a745', '#dc3545', '#ffc107']
        }]
      }
    });
  }
}