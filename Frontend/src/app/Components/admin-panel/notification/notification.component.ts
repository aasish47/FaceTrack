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

  //Getting Attendance request data from DetailsUserPanel.Views
  attendanceRequests: AttendanceRequest[] = [];

  private apiUrl = 'http://localhost:8000/api/attendance-requests/'; //url of getting attendance request

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAttendanceRequests();
  }

  loadAttendanceRequests(): void {
    this.http.get<AttendanceRequest[]>(this.apiUrl).subscribe(
      (data: AttendanceRequest[]) => {
        this.attendanceRequests = data; // Store the fetched data
      },
      (error) => {
        console.error('Error fetching attendance requests', error); // Handle errors
      }
    );
  }


  //Deleting Attendance request when admin clicks on decline
  deleteAttendanceRequest(requestId: number): void {
    const deleteUrl = `http://localhost:8000/api/delete-attendance-request/${requestId}/`;
    this.http.delete(deleteUrl).subscribe(
      () => {
        // Remove the deleted request from the local array
        this.attendanceRequests = this.attendanceRequests.filter(request => request.Id !== requestId);
        console.log('Attendance request deleted successfully!');
      },
      (error) => {
        console.error('Error deleting attendance request', error);
      }
    );
  }


  //Accepting Attendance request when admin clicks on accept
  //and sending the data to attendance table
  acceptAttendanceRequest(id: number): void {
    const requestToAccept = this.attendanceRequests.find(request => request.Id === id);

    if (requestToAccept) {
      // Prepare the data to send to the backend (UserId, Date, TimeIn, TimeOut)
      const attendanceData = {
        UserId: requestToAccept.UserId,
        Date: requestToAccept.Date,
        TimeIn: '08:30',   // Default TimeIn
        TimeOut: '18:00'   // Default TimeOut
      };

      // Send the data to the backend to create an attendance record
      this.http.post('http://localhost:8000/DetailsAdminPanel/accept_attendance_request/', attendanceData).subscribe(
        (response) => {
          console.log('Attendance recorded successfully', response);
          alert('Attendance request accepted and attendance recorded!');

          // Call deleteAttendanceRequest to remove the approved request
        this.deleteAttendanceRequest(id);
        },
        (error) => {
          console.error('Error recording attendance', error);
          alert('An error occurred while accepting the request.');
        }
      );
    } else {
      console.error('Request not found');
    }
  }
}