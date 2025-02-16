import { Component, Input } from '@angular/core';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  itemsPerPage: number = 10;
  currentPage: number = 1;

  @Input() students: Student[] = []

  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }
}
