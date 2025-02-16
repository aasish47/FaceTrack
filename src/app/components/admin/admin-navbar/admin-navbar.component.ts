import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  constructor(private router: Router) {}

  @Output() Sidebartoggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.Sidebartoggle.emit(this.isSidebarOpen);
    console.log(this.isSidebarOpen);
  }


  @Output() openAddUserModal = new EventEmitter<void>();

  triggerAddUserModal() {
    this.openAddUserModal.emit();
  }
  

  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }
}
