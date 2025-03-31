import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  animations:[
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
    ])
  ] 
})
export class AdminPanelComponent {

  // Sidebar toggle state
  isSidebarOpen: boolean = true;
  currentRoute: string = '';
  activeSection: string = 'dashboard';
  isDarkMode = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
   }
   ngOnInit(){
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
    }
   }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Change the active section based on button click
  showSection(section: string) {
    this.activeSection = section;
    this.router.navigate([`/admin-panel/${section}`]);
  }

  // Trigger Add User modal
  triggerAddUserModal() {
    console.log("Add User Modal Triggered");
  }

  // Logout and navigate to login page
  logout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('adminLoggedIn');
      this.router.navigate(['/login']);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

    // Apply theme globally to body
    document.body.classList.toggle('bg-dark', this.isDarkMode);
    document.body.classList.toggle('text-light', this.isDarkMode);
    document.body.classList.toggle('bg-light', !this.isDarkMode);
    document.body.classList.toggle('text-dark', !this.isDarkMode);
  }

  applyTheme() {
    document.body.classList.toggle('bg-dark', this.isDarkMode);
    document.body.classList.toggle('text-light', this.isDarkMode);
    document.body.classList.toggle('bg-light', !this.isDarkMode);
    document.body.classList.toggle('text-dark', !this.isDarkMode);
  }
}