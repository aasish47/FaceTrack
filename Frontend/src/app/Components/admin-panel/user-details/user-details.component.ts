import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  userDesignation: string;
  userPhoto: string;
  isEditing?: boolean; // Optional property for editing state
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

  constructor(private http: HttpClient) {}

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
      this.http.delete(`http://localhost:8000/Registration/user/${userId}`).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.userId !== userId);
          this.filteredUsers = [...this.users];
          console.log('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
