import { Component, Input } from '@angular/core';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.css']
})
export class AttendanceLogsComponent {

  itemsPerPage: number = 10;
  currentPage: number = 1;

  @Input() students: Student[] = [];
}
