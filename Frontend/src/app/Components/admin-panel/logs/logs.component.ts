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
  private apiUrl = 'http://127.0.0.1:8000/logs/userAttendance/'; 
  attendanceData: any = [];

  ngOnInit(): void {
    this.http.get(this.apiUrl).subscribe(data => {
      this.attendanceData = data;
    });
  }

  itemsPerPage: number = 10;
  currentPage: number = 1;
  
  editStudent(attendanceData: any) {
    console.log('Editing student:', attendanceData);
    attendanceData.isEditing = true;
  }

  saveStudent(attendanceData: any) {
    console.log('Saving student:', attendanceData);
  
    if (!attendanceData.id) {
      console.error('Error: Student ID is missing.');
      return;
    }
  
    const updateUrl = `${this.apiUrl}${attendanceData.id}/`; // Correct API endpoint
  
    this.http.put(updateUrl, {
      time_in: attendanceData.time_in, 
      time_out: attendanceData.time_out,
      date: attendanceData.date
    }).subscribe(
      response => {
        console.log('Attendance updated:', response);
        attendanceData.isEditing = false;
      },
      error => {
        console.error('Error updating attendance:', error);
      }
    );
  }
  deleteUser(attendanceData: any): void {
    if (!attendanceData.id) {
      console.error("Error: Attendance ID is missing.");
      return;
    }
  
    const deleteUrl = `${this.apiUrl}${attendanceData.id}/`;
  
    if (confirm('Are you sure you want to delete this record?')) {
      this.http.delete(deleteUrl).subscribe({
        next: () => {
          this.attendanceData = this.attendanceData.filter(
            (record: any) => record.id !== attendanceData.id
          );
  
          console.log('Attendance record deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting attendance record:', error);
        }
      });
    }
  }
  
  
  
  
}
