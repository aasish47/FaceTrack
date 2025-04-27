import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { UserService } from 'src/app/services/user.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  userDesignation: string;
  userPhoto: string;
  isEditing?: boolean;
}

interface AttendanceRecord {
  date: string;
  time_in: string;
  time_out: string;
  status?: 'present' | 'late' | 'absent';
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  searchSubject = new Subject<string>();

  // Modal Data
  selectedUserPhoto: string = 'assets/default-user.png';
  selecteduserName: string = '';
  selectedUserDesignation: string = '';
  recentLogs: string[] = [];

  constructor(private userService: UserService, private http: HttpClient) {
    // Add debounce for search input
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterUsers();
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchDepartments();
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

  // Add method for filtering users
  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.userName.toLowerCase().includes(searchTermLower) ||
      user.userEmail.toLowerCase().includes(searchTermLower) ||
      user.userDepartment.toLowerCase().includes(searchTermLower) ||
      user.userDesignation.toLowerCase().includes(searchTermLower)
    );
  }

  // Update input handler in the template to use:
  onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  getUserInitials(userName: string): string {
    return userName.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  editUser(user: User): void {
    this.users.forEach(u => u.isEditing = false); // Close other edits
    user.isEditing = true;
  }

  saveUser(user: User): void {
    this.http.put(`http://localhost:8000/Registration/user/${user.userId}`, user).subscribe({
      next: () => {
        user.isEditing = false;
        console.log('User updated successfully');
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8000/Registration/user/${userId}`).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.userId !== userId);
          this.filteredUsers = [...this.users];
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  viewUserDetails(user: User): void {
    const userId = Number(user.userId);

    this.userService.getUserDetails(userId).subscribe({
      next: (data: User) => {
        this.selecteduserName = data.userName;
        this.selectedUserDesignation = data.userDesignation;
        this.selectedUserPhoto = data.userPhoto
          ? `data:image/jpeg;base64,${data.userPhoto}`
          : 'assets/default-user.png';

        this.userService.getUserAttendance(userId).subscribe({
          next: (attendanceData: AttendanceRecord[]) => {
            this.processAttendanceData(attendanceData);
            this.showModal();
          },
          error: (error) => {
            console.error('Error fetching attendance:', error);
            this.showModal();
          }
        });
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  private showModal(): void {
    const modalElement = document.getElementById('userDetailsModal');
    if (modalElement) {
      new bootstrap.Modal(modalElement).show();
    }
  }

  private calculateLoggedHours(item: AttendanceRecord): number {
    if (item.time_in === '00:00:00' || item.time_out === '00:00:00') {
      return 0;
    }
    const timeIn = new Date(`1970-01-01T${item.time_in}`);
    const timeOut = new Date(`1970-01-01T${item.time_out}`);
    return (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`;
  }

  // Update chart data properties
  attendanceChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} hours`
        }
      }
    }
  };

  private processAttendanceData(attendanceData: AttendanceRecord[]): void {
    // Group attendance records by date and calculate total hours per day
    const dailyHours: { [date: string]: number } = {};

    attendanceData.forEach(item => {
      const date = item.date.split('T')[0]; // Get just the date part (YYYY-MM-DD)
      const hours = this.calculateLoggedHours(item);

      if (!dailyHours[date]) {
        dailyHours[date] = 0;
      }
      dailyHours[date] += hours;
    });

    // Convert to array of { date, totalHours } and take last 5 entries
    const dailySummaries = Object.entries(dailyHours)
      .map(([date, totalHours]) => ({ date, totalHours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-5)
      .reverse();

    // Prepare chart data
    this.attendanceChartData = {
      labels: dailySummaries.map(item => this.formatDate(item.date)),
      datasets: [{
        data: dailySummaries.map(item => item.totalHours),
        label: 'Logged Hours',
        backgroundColor: 'rgba(63, 128, 255, 0.5)',
        borderColor: 'rgba(63, 128, 255, 1)',
        borderWidth: 1
      }]
    };

    // Prepare recent logs
    this.recentLogs = attendanceData.slice(-5).reverse().map(item => {
      if (item.time_in !== '00:00:00' && item.time_out === '00:00:00') {
        return `Logged in at ${this.formatTime(item.time_in)}`;
      } else if (item.time_in === '00:00:00' && item.time_out !== '00:00:00') {
        return `Logged out at ${this.formatTime(item.time_out)}`;
      } else if (item.time_in !== '00:00:00' && item.time_out !== '00:00:00') {
        const hours = this.calculateLoggedHours(item).toFixed(1);
        return `Worked ${hours} hours (${this.formatTime(item.time_in)} - ${this.formatTime(item.time_out)})`;
      }
      return 'No attendance data';
    });
  }


  //Fetching departments from department table
  departments: any[] = [];

  fetchDepartments(): void {
    this.http.get('http://127.0.0.1:8000/Registration/department/')
      .subscribe(
        (response: any) => {
          this.departments = response;
        },
        (error: any) => {
          console.error('Error fetching departments:', error);
        }
      );
  }

}







