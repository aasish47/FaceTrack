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
}

export interface PastAttendanceRequest {
  Id: number;
  UserId: string;
  Name: string;
  Email: string;
  Date: string;
  Type: string;
  Reason: string;
  Status: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  //Getting Attendance request data from DetailsUserPanel.Views
  attendanceRequests: AttendanceRequest[] = [];
  currentDate = new Date();
  private apiUrl = 'http://localhost:8000/api/attendance-requests/';
  pastAttendanceRequests: PastAttendanceRequest[] = [];
  private apiUrl2 = 'http://localhost:8000/api/past-attendance-requests/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAttendanceRequests();
    this.loadPastAttendanceRequests();
    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadAttendanceRequests();
      this.loadPastAttendanceRequests();
    }, 30000);
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

  loadPastAttendanceRequests(): void {
    this.http.get<PastAttendanceRequest[]>(this.apiUrl2).subscribe({
      next: (data: PastAttendanceRequest[]) => {
        this.pastAttendanceRequests = data;
      },
      error: (error) => {
        console.error('Error fetching past attendance requests', error);
      }
    });
  }
  
  //Deleting Attendance request when admin clicks on decline
  deleteAttendanceRequest(requestId: number): void {
    const isConfirmed = window.confirm('Are you sure you want to reject this request for the user?');

    if (isConfirmed) {
      const deleteUrl = `http://localhost:8000/api/delete-attendance-request/${requestId}/`;
      this.http.delete(deleteUrl).subscribe({
        next: () => {
          this.attendanceRequests = this.attendanceRequests.filter(
            request => request.Id !== requestId
          );
          this.loadPastAttendanceRequests();
        },
        error: (error) => {
          console.error('Error deleting attendance request', error);
        }
      });
    } else {
      console.log('Attendance request rejection was canceled.');
    }
  }

  //Accepting Attendance request when admin clicks on accept
  //and sending the data to attendance table and past attendance table
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
      Name: requestToAccept.Name,
      Email: requestToAccept.Email,
      Type: requestToAccept.Type,
      Reason: requestToAccept.Reason,
      TimeIn: '08:30',
      TimeOut: '18:00'
    };
    
    // Send the data to the backend to save it in the PastAttendanceRequest table
    this.http.post(
      'http://localhost:8000/api/save-accepted-attendance-request/', 
      attendanceData
    ).subscribe({
      next: () => {
        alert('Attendance request accepted and saved to past attendance requests.');
      },
      error: (error) => {
        console.error('Error saving accepted attendance request', error);
        alert('Error accepting request. Please try again.');
      }
    });
    
    // Send the data to the backend to create an attendance record
    this.http.post(
      'http://localhost:8000/DetailsAdminPanel/accept_attendance_request/', 
      attendanceData
    ).subscribe({
      next: () => {
        // deleting approved attendance request from request table
        this.deleteAttendanceRequestOnAccept(id);
        this.loadPastAttendanceRequests();
      },
      error: (error) => {
        console.error('Error recording attendance', error);
        alert('Error accepting request. Please try again.');
      }
    });
  }

  //When admin clicks on accept, the request data gets add to main attendance table and by this function it gets deleted from the request table
  deleteAttendanceRequestOnAccept(requestId: number): void {
    const deleteUrl2 = `http://localhost:8000/api/delete_attendance_request_on_accept/${requestId}/`;
    this.http.delete(deleteUrl2).subscribe({
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
}