import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  // Sidebar toggle state
  isSidebarOpen: boolean = true;

  // Active section to show
  activeSection: string = 'dashboard'; // Default to dashboard

  constructor(private router: Router) { }

  // Toggle sidebar visibility
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Change the active section based on button click
  showSection(section: string) {
    // Use the router to navigate to the appropriate child route
    this.router.navigate([`/admin-panel/${section}`]);
  }

  // Trigger Add User modal (implement your modal logic here)
  triggerAddUserModal() {
    console.log("Add User Modal Triggered");
  }

  // Logout and navigate to login page
  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }
}