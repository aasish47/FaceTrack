import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

interface Student {
  id: number;
  fullName: string;
  designation: string;
  department: string;
  status: string;
  time: string;
  isEditing: boolean;
}


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  activeSection: string = 'dashboard';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  
  showFilters: boolean = false;
  selectedId: string = '';
  selectedDepartment: string = '';
  selectedStatus: string = '';

  constructor(private router: Router) { }
  // test: string = 'test';

  @ViewChild('attendanceChart') attendanceChart!: ElementRef;

  ngOnInit() {
    if (localStorage.getItem('adminLoggedIn') != 'true') {
      this.router.navigate(['/admin-login']);
    }
    // Fetch attendance data from backend api
  }

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
  students: Student[] = [
    { id: 1, fullName: 'John Doe', designation: 'Student', department: 'Computer Science', status: 'Present', time: '08:30 AM', isEditing: false },
    { id: 2, fullName: 'Jane Smith', designation: 'Student', department: 'Mathematics', status: 'Absent', time: 'N/A', isEditing: false },
    { id: 3, fullName: 'Emily Johnson', designation: 'Student', department: 'Physics', status: 'Late', time: '09:15 AM', isEditing: false },
    { id: 4, fullName: 'John', designation: 'Teacher', department: 'Computer Science', status: 'Present', time: '08:31 AM', isEditing: false },
    { id: 5, fullName: 'Alice Brown', designation: 'Student', department: 'Biology', status: 'Present', time: '08:45 AM', isEditing: false },
    { id: 6, fullName: 'Michael Green', designation: 'Student', department: 'Chemistry', status: 'Late', time: '09:10 AM', isEditing: false },
    { id: 7, fullName: 'Chris White', designation: 'Student', department: 'Physics', status: 'Present', time: '08:50 AM', isEditing: false },
    { id: 8, fullName: 'Jessica Lee', designation: 'Student', department: 'Mathematics', status: 'Late', time: '09:20 AM', isEditing: false },
    { id: 9, fullName: 'David Kim', designation: 'Student', department: 'Engineering', status: 'Present', time: '08:40 AM', isEditing: false },
    { id: 10, fullName: 'Sophia Clark', designation: 'Student', department: 'Computer Science', status: 'Absent', time: 'N/A', isEditing: false },
    { id: 11, fullName: 'Daniel Martinez', designation: 'Student', department: 'Physics', status: 'Late', time: '09:10 AM', isEditing: false },
    { id: 12, fullName: 'Olivia Hernandez', designation: 'Student', department: 'Biology', status: 'Present', time: '08:35 AM', isEditing: false },
    { id: 13, fullName: 'William Scott', designation: 'Teacher', department: 'Mathematics', status: 'Present', time: '08:32 AM', isEditing: false },
    { id: 14, fullName: 'Isabella Adams', designation: 'Student', department: 'Engineering', status: 'Late', time: '09:05 AM', isEditing: false },
    { id: 15, fullName: 'James Carter', designation: 'Student', department: 'Chemistry', status: 'Present', time: '08:55 AM', isEditing: false },
    { id: 16, fullName: 'Charlotte Lewis', designation: 'Student', department: 'Biology', status: 'Late', time: '09:05 AM', isEditing: false },
    { id: 17, fullName: 'Benjamin Walker', designation: 'Student', department: 'Computer Science', status: 'Present', time: '08:48 AM', isEditing: false },
    { id: 18, fullName: 'Mia Hall', designation: 'Student', department: 'Physics', status: 'Absent', time: 'N/A', isEditing: false },
    { id: 19, fullName: 'Ethan Allen', designation: 'Student', department: 'Engineering', status: 'Present', time: '08:42 AM', isEditing: false },
    { id: 20, fullName: 'Harper Young', designation: 'Student', department: 'Mathematics', status: 'Late', time: '09:18 AM', isEditing: false },
    { id: 21, fullName: 'Alexander King', designation: 'Student', department: 'Physics', status: 'Present', time: '08:47 AM', isEditing: false },
    { id: 22, fullName: 'Amelia Nelson', designation: 'Student', department: 'Chemistry', status: 'Absent', time: 'N/A', isEditing: false },
    { id: 23, fullName: 'Lucas Robinson', designation: 'Student', department: 'Engineering', status: 'Present', time: '08:51 AM', isEditing: false },
    { id: 24, fullName: 'Ella Baker', designation: 'Student', department: 'Computer Science', status: 'Late', time: '09:12 AM', isEditing: false }
  ];

  filteredStudents = [...this.students];

  uniqueDepartments = Array.from(
    new Map(this.students.map(student => [student.department, student])).values()
  );

  uniqueStatus = Array.from(
    new Map(this.students.map(student => [student.status, student])).values()
  );

  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }


  // Will be used when backend is integrated

  // saveStudent(student: any) {
  //   this.http.put(`http://127.0.0.1:8000/api/students/${student.id}/`, student).subscribe(response => {
  //     console.log('Update successful', response);
  //     student.isEditing = false;
  //   }, error => {
  //     console.error('Error updating student', error);
  //   });
  // }


  showSection(section: string) {
    this.activeSection = section;
    if (this.activeSection == 'reports') {
      setTimeout(() => this.loadChart(), 100);
    }
  }

  // Filter And Reset Start
  toggleFilters() {
    this.showFilters = !this.showFilters; // Toggle visibility
  }
  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      return (
        (!this.selectedId || student.id.toString()===this.selectedId) &&
        (!this.selectedDepartment || student.department === this.selectedDepartment) &&
        (!this.selectedStatus || student.status === this.selectedStatus)
      );
    });
  }
  onResetFilters() {
    this.selectedId = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.filteredStudents = [...this.students]; // Reset table to original data
  }
  // Filter And Reset End

  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
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
