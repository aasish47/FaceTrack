import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateX(-15px)'
      })),
      transition('in <=> out', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminPanelComponent implements OnInit {
  isSidebarOpen = true;
  currentRoute = '';
  isDarkMode = false;
  showProfileMenu = false;
  unreadNotifications = 3; // Example count
  currentTime = new Date();
  themeClass = 'light-theme';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    if (!localStorage.getItem('adminLoggedIn')) {
      this.router.navigate(['/login']);
    }
  
    // Load saved theme
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showSection(section: string) {
    this.router.navigate([`/admin-panel/${section}`]);
    this.showProfileMenu = false;
  }

  logout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('adminLoggedIn');
      this.router.navigate(['/login']);
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }




  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    this.themeClass = this.isDarkMode ? 'dark-theme' : 'light-theme';
  
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(this.themeClass);
  
    const container = document.querySelector('.admin-content');
    if (container) {
      container.classList.remove('light-theme', 'dark-theme');
      container.classList.add(this.themeClass);
    }
  }


}