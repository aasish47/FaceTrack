import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent {

  // Sidebar toggle state
  isSidebarOpen: boolean = true;
  isNotificationOpen: boolean = false;
  currentRoute: string = '';

  notifications: string[] = [
    "Your attendance has been marked successfully.",
    "New update available for the system.",
    "Your profile details were updated.",
    "Meeting scheduled for tomorrow at 10 AM."
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleNotificationPanel() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  showSection(section: string) {
    this.router.navigate([`/user-panel/${section}`]);
  }

  logout() {
    localStorage.removeItem('userLoggedIn');
    this.router.navigate(['/login']);
  }
}
