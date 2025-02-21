import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
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
export class UserPanelComponent {

  // Sidebar toggle state
  isSidebarOpen: boolean = true;
  currentRoute: string = '';
  activeSection: string = 'dashboard';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
   }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Change the active section based on button click
  showSection(section: string) {
    this.activeSection = section;
    this.router.navigate([`/user-panel/${section}`]);
  }

  // Logout and navigate to login page
  logout() {
    localStorage.removeItem('userLoggedIn');
    this.router.navigate(['/login']);
  }
}