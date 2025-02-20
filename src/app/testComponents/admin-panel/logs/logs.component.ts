import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/student.service';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

export class LogsComponent {
  itemsPerPage: number = 10;
  currentPage: number = 1;
  students: Student[] = [];
  
  constructor( private studentservice:StudentService){
    
  }

  ngOnInit(){
    this.students=this.studentservice.getStudents();
  }
  
  editStudent(student: Student) {
    console.log('Editing student:', student);
    student.isEditing = true;
  }

  saveStudent(student: Student) {
    console.log('Saving student:', student);
    student.isEditing = false;
  }
}
