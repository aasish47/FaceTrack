import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/logs/userAttendance/';
  attendanceData: any[] = [];
  showNewAttendanceForm: boolean = false;
  isFormSubmitted: boolean = false;
  itemsPerPage: number = 10;
  currentPage: number = 1;

  newUserAttendance = {
    user_id: '',
    time_in: '',
    time_out: '',
    date: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchAttendanceData();
  }

  fetchAttendanceData(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.attendanceData = data;
      },
      error: (error) => {
        console.error('Error fetching attendance data:', error);
      }
    });
  }

  calculateDuration(timeIn: string, timeOut: string): string {
    if (!timeIn || !timeOut || timeIn === '00:00:00' || timeOut === '00:00:00') {
      return 'N/A';
    }

    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    let hours = outHours - inHours;
    let minutes = outMinutes - inMinutes;

    if (minutes < 0) {
      hours--;
      minutes += 60;
    }

    return `${hours}h ${minutes}m`;
  }

  editUser(attendance: any): void {
    this.attendanceData.forEach(a => a.isEditing = false);
    attendance.isEditing = true;
  }

  saveUser(attendance: any): void {
    if (!attendance.id) {
      console.error('Error: Attendance ID is missing.');
      return;
    }

    const updateUrl = `${this.apiUrl}${attendance.id}/`;
    
    this.http.put(updateUrl, {
      time_in: attendance.time_in,
      time_out: attendance.time_out,
      date: attendance.date
    }).subscribe({
      next: () => {
        attendance.isEditing = false;
        this.fetchAttendanceData();
      },
      error: (error) => {
        console.error('Error updating attendance:', error);
      }
    });
  }

  deleteUser(attendance: any): void {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    if (!attendance.id) {
      console.error('Error: Attendance ID is missing.');
      return;
    }

    const deleteUrl = `${this.apiUrl}${attendance.id}/`;

    this.http.delete(deleteUrl).subscribe({
      next: () => {
        this.attendanceData = this.attendanceData.filter(a => a.id !== attendance.id);
      },
      error: (error) => {
        console.error('Error deleting attendance:', error);
      }
    });
  }

  onSubmit(form: NgForm): void {
    this.isFormSubmitted = true;

    if (!this.newUserAttendance.user_id?.trim()) {
      alert('Error: User ID is required!');
      return;
    }

    const checkUserUrl = `http://127.0.0.1:8000/Registration/user/${this.newUserAttendance.user_id}/exists/`;

    this.http.get(checkUserUrl).subscribe({
      next: (response: any) => {
        if (response.exists) {
          this.http.post(this.apiUrl, this.newUserAttendance).subscribe({
            next: () => {
              alert('Attendance recorded successfully!');
              this.onReset();
              this.fetchAttendanceData();
            },
            error: (error) => {
              console.error('Error recording attendance:', error);
              alert('Error recording attendance. Please try again.');
            }
          });
        } else {
          alert('Error: User ID does not exist!');
        }
      },
      error: (error) => {
        console.error('Error checking user:', error);
        alert('Error verifying user. Please try again.');
      }
    });
  }

  onReset(): void {
    this.newUserAttendance = {
      user_id: '',
      time_in: '',
      time_out: '',
      date: ''
    };
    this.isFormSubmitted = false;
    this.showNewAttendanceForm = false;
  }

  showSection(): void {
    this.showNewAttendanceForm = !this.showNewAttendanceForm;
  }
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.attendanceData.length);
    return `${start} to ${end} of ${this.attendanceData.length} entries`;
  }
}