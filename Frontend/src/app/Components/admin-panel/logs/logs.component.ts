import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

export class LogsComponent {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://127.0.0.1:8000/userAttendance/'; 
  attendanceData: any = [];
  ngOnInit(): void {
    this.http.get(this.apiUrl).subscribe(data => {
      this.attendanceData = data;
    });
  }

  itemsPerPage: number = 10;
  currentPage: number = 1;
  

  
  
  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }
}
