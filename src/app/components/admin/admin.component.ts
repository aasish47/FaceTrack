import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/models/student.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  activeSection: string = 'dashboard';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  isSidebarOpen: boolean = true;
  constructor(private router: Router) { }
  // test: string = 'test';

  ngOnInit() {
    if (localStorage.getItem('adminLoggedIn') != 'true') {
      this.router.navigate(['/admin-login']);
    }
    // Fetch attendance data from backend api
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

  toggleSidebar(value: boolean) {
    this.isSidebarOpen = value;
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


  showSection(value: string) {
    console.log("Admin Section",value);
    this.activeSection = value;
  }


  isAddUserModalOpen = false;

  openAddUserModal() {
    this.isAddUserModalOpen = true;
  }

  closeAddUserModal() {
    this.isAddUserModalOpen = false;
  }

  userAdded(value: boolean){
    if(value){
      alert('User added successfully!');
    }
  }
}
