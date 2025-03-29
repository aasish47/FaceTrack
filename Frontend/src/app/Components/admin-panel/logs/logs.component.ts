import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Form, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

export class LogsComponent {
  constructor(private http: HttpClient, private router: Router) { }
  private apiUrl = 'http://127.0.0.1:8000/logs/userAttendance/';
  attendanceData: any = [];
  activeSection = "attendance-log"
  isFormSubmitted: boolean = false;
  showNewAttendanceForm: boolean = false;
  newUserAttendance: any = {
    user_id: '',
    time_in: '',
    time_out: '',
    date: ''
  };

  ngOnInit(): void {
    this.http.get(this.apiUrl).subscribe(data => {
      this.attendanceData = data;
    });
  }

  itemsPerPage: number = 10;
  currentPage: number = 1;

  editUser(attendanceData: any) {
    console.log('Editing student:', attendanceData);
    attendanceData.isEditing = true;
  }

  saveUser(attendanceData: any) {
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
  onSubmit(form: NgForm) {
    this.isFormSubmitted = true;
  
    if (!this.newUserAttendance.user_id || this.newUserAttendance.user_id.trim() === '') {
      window.alert(" Error: User ID is required!");
      return; 
    }
  
    // Check if user_id exists in the database before submitting
    const checkUserUrl = `http://127.0.0.1:8000/Registration/user/${this.newUserAttendance.user_id}/exists/`;
  
    this.http.get(checkUserUrl).subscribe(
      (response: any) => {
        if (response.exists) {
          this.http.post("http://127.0.0.1:8000/logs/userAttendance/", this.newUserAttendance)
            .subscribe(response => {
              window.alert("Attendance Marked Successfully!");
              this.onReset();
            }, error => {
              console.error('Error  Marking attendance', error);
            });
        } else {
          window.alert("Error: User ID does not exist in the database!");
        }
      },
      error => {
        console.error('Error checking user existence', error);
        window.alert("Error: Unable to verify User ID. Please try again.");
      }
    );
  
    this.isFormSubmitted = false;
  }
  


  onReset() {
    this.newUserAttendance.user_id= '';
    this.newUserAttendance.time_in= '';
    this.newUserAttendance.time_out = '';
    this.newUserAttendance.date= '';
    
    this.isFormSubmitted = false;
    this.showNewAttendanceForm = false;
  }

  showSection() {
    this.showNewAttendanceForm = !this.showNewAttendanceForm;
  }


}
