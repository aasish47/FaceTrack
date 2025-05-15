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
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}