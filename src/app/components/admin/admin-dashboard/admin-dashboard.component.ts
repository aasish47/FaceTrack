import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  itemsPerPage: number = 10;
  currentPage: number = 1;

  @ViewChild('attendanceChart') attendanceChart!: ElementRef;
  @Input() students: Student[] = [];
  
  ngAfterViewInit() {
    this.loadChart();
  }


   loadChart() {
      new Chart(this.attendanceChart.nativeElement, {
        type: "bar",
        data: {
          labels: ['present', 'absent', 'late'],
          datasets: [{
            label: 'Attendance Chart',
            data: [this.presentStudents, this.absentStudents, this.lateStudents],
            backgroundColor: ['#28a745', '#dc3545', '#ffc107']
          }]
        }
      });
    }
    get totalStudents(): number {
      return this.students.length;
    }
  
    get presentStudents(): number {
      return this.students.filter(s => s.status === 'Present').length;
    }
  
    get absentStudents(): number {
      return this.students.filter(s => s.status === 'Absent').length;
    }
  
    get lateStudents(): number {
      return this.students.filter(s => s.status === 'Late').length;
    }
}
