import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Output() sectionChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() isSidebarOpen: boolean = true;

  showSection(section: string) {
    this.sectionChanged.emit(section);
  }

}
