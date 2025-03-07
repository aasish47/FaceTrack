import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  user = {
    name: 'Tony Stark',
    email: 'Ironman@marvel.com',
    role: 'Manager'
  };

  editProfileForm: FormGroup;
  isEditing: boolean = false; // Track edit mode

  attendanceData = [{ data: [80, 90, 75, 95, 85], label: 'Attendance' }];
  attendanceLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  recentLogs = [
    'Logged in at 8:45 AM',
    'Timed out for lunch at 2:00 PM',
    'Timed in after lunch at 2:45 PM',
    'Logged out at 4:45 PM'
  ];

  notifications = [
    'Your attendance is above 85%',
    'New schedule updated for next week',
    'Holiday announced on Friday'
  ];

  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      role: [this.user.role, Validators.required]
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editProfileForm.patchValue(this.user); // Populate form with user data
    }
  }

  saveProfile() {
    if (this.editProfileForm.valid) {
      this.user = { ...this.editProfileForm.value }; // Update user data
      this.isEditing = false; // Exit edit mode
      console.log('Profile Updated:', this.user);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }
  updateProfile(){

  }
  changePassword(){

  }
}
