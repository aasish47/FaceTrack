import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Student {
  id: number;
  fullName: string;
  designation: string;
  department: string;
  status: string;
  time: string;
}


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  activeSection: string = 'dashboard';
  constructor(private router: Router) {}

  ngOnInit() {
    if(localStorage.getItem('adminLoggedIn') != 'true'){
      this.router.navigate(['/admin-login']);
    }
    // Fetch attendance data from a service
  }
  students: Student[] = [
    { id: 1, fullName: 'John Doe', designation: 'Student', department: 'Computer Science', status: 'Present', time: '08:30 AM' },
    { id: 2, fullName: 'Jane Smith', designation: 'Student', department: 'Mathematics', status: 'Absent', time: 'N/A' },
    { id: 3, fullName: 'Emily Johnson', designation: 'Student', department: 'Physics', status: 'Late', time: '09:15 AM' }
  ];

  editStudent(student: Student) {
    console.log('Editing student:', student);
    // Implement edit logic (e.g., open a modal or navigate to an edit form)
  }

  showSection(section: string){
    this.activeSection = section;
  }

  logout(){
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }

}
