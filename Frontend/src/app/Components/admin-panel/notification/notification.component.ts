import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AttendanceRequest {
  Id: number;
  UserId: string;
  Name: string;
  Email: string;
  Date: string;
  Type: string;
  Reason: string;
  Status?: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  attendanceRequests: AttendanceRequest[] = [];
  currentDate = new Date();
  private apiUrl = 'http://localhost:8000/api/attendance-requests/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAttendanceRequests();
    // Refresh data every 30 seconds
    setInterval(() => this.loadAttendanceRequests(), 30000);
  }

  loadAttendanceRequests(): void {
    this.http.get<AttendanceRequest[]>(this.apiUrl).subscribe({
      next: (data: AttendanceRequest[]) => {
        this.attendanceRequests = data;
        this.currentDate = new Date();
      },
      error: (error) => {
        console.error('Error fetching attendance requests', error);
      }
    });
  }

  deleteAttendanceRequest(requestId: number): void {
    if (!confirm('Are you sure you want to decline this request?')) {
      return;
    }

    const deleteUrl = `http://localhost:8000/api/delete-attendance-request/${requestId}/`;
    this.http.delete(deleteUrl).subscribe({
      next: () => {
        this.attendanceRequests = this.attendanceRequests.filter(
          request => request.Id !== requestId
        );
      },
      error: (error) => {
        console.error('Error deleting attendance request', error);
      }
    });
  }

  acceptAttendanceRequest(id: number): void {
    const requestToAccept = this.attendanceRequests.find(
      request => request.Id === id
    );

    if (!requestToAccept) {
      console.error('Request not found');
      return;
    }

    if (!confirm(`Accept attendance request for ${requestToAccept.Name}?`)) {
      return;
    }

    const attendanceData = {
      UserId: requestToAccept.UserId,
      Date: requestToAccept.Date,
      TimeIn: '08:30',
      TimeOut: '18:00'
    };

    this.http.post(
      'http://localhost:8000/DetailsAdminPanel/accept_attendance_request/', 
      attendanceData
    ).subscribe({
      next: () => {
        this.deleteAttendanceRequest(id);
      },
      error: (error) => {
        console.error('Error recording attendance', error);
        alert('Error accepting request. Please try again.');
      }
    });
  }
}