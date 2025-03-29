import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap'; // Ensure Bootstrap is imported
import { UserService } from 'src/app/services/user.service'; // Import UserService

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  userDesignation: string;
  userPhoto: string;
  isEditing?: boolean; // Optional property for editing state
}

interface AttendanceRecord {
  date: string;
  time_in: string;
  time_out: string;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: User[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  filteredUsers: User[] = [];
  attendanceData: { data: number[]; label: string }[] = [];
  attendanceLabels: string[] = [];
  recentLogs: string[] = [];
  selectedUserPhoto: string = ''; // Add a property to hold the selected user's photo
  selecteduserName: string = ''; // Add a property to hold the selected user's name

  constructor(private userService: UserService, private http: HttpClient) {} // Inject HttpClient

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:8000/Registration/user/').subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    user.isEditing = true; // Enable editing mode
  }

  saveUser(user: User): void {
    console.log('Saving user:', user);
    user.isEditing = false; // Disable editing mode

    // Send a PUT request to update the user data in the backend
    this.http.put(`http://localhost:8000/Registration/user/${user.userId}`, user).subscribe({
      next: () => {
        console.log('User updated successfully in the backend');
      },
      error: (error) => {
        console.error('Error updating user in the backend:', error);
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete<void>(`http://localhost:8000/Registration/user/${userId}`).subscribe({
        next: (): void => {
          this.users = this.users.filter((user: User) => user.userId !== userId);
          this.filteredUsers = [...this.users];
          console.log('User deleted successfully');
        },
        error: (error: any): void => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  viewUserDetails(user: User): void {
    console.log('User clicked:', user); // Debugging

    const userId = Number(user.userId);

    // Fetch User Details (including photo)
    this.userService.getUserDetails(userId).subscribe({
      next: (data: User) => {
        console.log('User details fetched:', data); // Debugging
        this.selecteduserName= data.userName;
        // Set the user's photo
        this.selectedUserPhoto = data.userPhoto
          ? `data:image/jpeg;base64,${data.userPhoto}`
          : 'assets/default-user.png'; // Fallback to a default image if no photo is available

        // Fetch Attendance Data
        this.userService.getUserAttendance(userId).subscribe({
          next: (attendanceData: AttendanceRecord[]) => {
            console.log('Attendance data fetched:', attendanceData); // Debugging

            const lastFive = attendanceData.slice(-5); // Get last 5 records

            this.attendanceData = [
              {
                data: lastFive.map(item => this.calculateLoggedHours(item)),
                label: 'Logged Hours'
              }
            ];

            this.attendanceLabels = lastFive.map(item => item.date);

            this.recentLogs = lastFive.map(item => {
              if (item.time_in !== '00:00:00' && item.time_out === '00:00:00') {
                return `Date: ${item.date} | Logged in at ${item.time_in}`;
              } else if (item.time_in === '00:00:00' && item.time_out !== '00:00:00') {
                return `Date: ${item.date} | Logged out at ${item.time_out}`;
              } else if (item.time_in !== '00:00:00' && item.time_out !== '00:00:00') {
                return `Date: ${item.date} | Logged in at ${item.time_in}, Logged out at ${item.time_out}`;
              } else {
                return `Date: ${item.date} | No login or logout data`;
              }
            });

            // Show the modal
            const modalElement = document.getElementById('userDetailsModal');
            if (modalElement) {
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
            }
          },
          error: (error) => {
            console.error('Error fetching attendance data:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  calculateLoggedHours(item: AttendanceRecord): number {
    if (item.time_in === '00:00:00' || item.time_out === '00:00:00') {
      return 0; // Don't calculate if incomplete data
    }
    const timeIn = new Date(`1970-01-01T${item.time_in}`);
    const timeOut = new Date(`1970-01-01T${item.time_out}`);
    const diffInMs = timeOut.getTime() - timeIn.getTime();
    return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
  }
}
