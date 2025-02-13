import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}
  test: string = 'test';

  ngOnInit() {
    if(localStorage.getItem('adminLoggedIn') != 'true'){
      this.router.navigate(['/admin-login']);
    }
    // Fetch attendance data from a service
  }
  students: Student[] = [
    { id: 1, fullName: 'John Doe', designation: 'Student', department: 'Computer Science', status: 'Present', time: '08:30 AM', isEditing: false},
    { id: 2, fullName: 'Jane Smith', designation: 'Student', department: 'Mathematics', status: 'Absent', time: 'N/A', isEditing: false },
    { id: 3, fullName: 'Emily Johnson', designation: 'Student', department: 'Physics', status: 'Late', time: '09:15 AM', isEditing: false }
  ];

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


  showSection(section: string){
    this.activeSection = section;
  }

  logout(){
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }

}
