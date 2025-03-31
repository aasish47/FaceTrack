import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  isSidebarOpen: boolean = true;
  currentRoute: string = '';
  currentTime = new Date();
  userPhoto: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    // Update time every second
    interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });

    // Check authentication
    if (!localStorage.getItem('userLoggedIn')) {
      this.router.navigate(['/login']);
    }

    // Load user photo (example - replace with actual implementation)
    this.userPhoto = localStorage.getItem('userPhoto');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showSection(section: string) {
    this.router.navigate([`/user-panel/${section}`]);
  }

  logout() {
    localStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}