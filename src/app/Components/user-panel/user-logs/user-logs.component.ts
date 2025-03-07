import { Component } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.css']
})
export class UserLogsComponent {

  constructor(private studentService: StudentService) { }
  
    students = this.studentService.getLoggedinStudents();
  
    itemsPerPage: number = 10;
    currentPage: number = 1;
    filteredStudents: any[] = [];
    loggedinUser: string = 'Emily Johnson';
    
    ngOnInit() {
      this.filteredStudents = this.students.filter(s => s.fullName === this.loggedinUser);
    }

}
