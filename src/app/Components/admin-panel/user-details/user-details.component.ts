import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  constructor(private studentService: StudentService) { }

  students: Student[] = this.studentService.getStudents();

  itemsPerPage: number = 10;
  currentPage: number = 1;
  filteredStudents:Student[]=[...this.students];



  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }
}
