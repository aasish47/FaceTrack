import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/student.service';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

<<<<<<< HEAD

=======
>>>>>>> 9201769670ff872c9ab80c14a22f7ae272e83a06
export class LogsComponent {

  constructor(private studentService: StudentService) { }

  students: Student[] = this.studentService.getStudents();

  itemsPerPage: number = 10;
  currentPage: number = 1;
<<<<<<< HEAD
  filteredStudents:Student[]=[...this.students];

  
=======
  students: Student[] = [];
  
  constructor( private studentservice:StudentService){
    
  }

  ngOnInit(){
    this.students=this.studentservice.getStudents();
  }
>>>>>>> 9201769670ff872c9ab80c14a22f7ae272e83a06
  
  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }
}
