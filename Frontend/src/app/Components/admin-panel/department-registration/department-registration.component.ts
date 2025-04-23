import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-registration',
  templateUrl: './department-registration.component.html',
  styleUrls: ['./department-registration.component.css']
})
export class DepartmentRegistrationComponent {
  departmentForm = {
    departmentId: '',
    departmentName: '',
    departmentHead: ''
  };
  
  deleteDepartmentId: string = '';
  showDeleteSection: boolean = false;
  isFormSubmitted = false;

  constructor(private http: HttpClient) {}

  onSubmit(form: any): void {
    this.isFormSubmitted = true;

    if (form.valid) {
      this.http.post('http://127.0.0.1:8000/Registration/department/', this.departmentForm)
        .subscribe(
          (response: any) => {
            console.log('Response:', response);
            alert('Department Registered Successfully!');
            this.onReset();
          },
          (error: any) => {
            console.error('Error:', error);
            alert('Failed to register department. Please try again.');
          }
        );
    } else {
      alert('Please fill all required fields.');
    }
  }

  onReset(): void {
    this.departmentForm = {
      departmentId: '',
      departmentName: '',
      departmentHead: ''
    };
    this.isFormSubmitted = false;
  }

  toggleDeleteSection(): void {
    this.showDeleteSection = !this.showDeleteSection;
  }

  //deletion of a department
  onDeleteDepartment(): void {
    if (!this.deleteDepartmentId) {
      alert("Please provide a valid Department ID.");
      return;
    }
  
    this.http.delete(`http://127.0.0.1:8000/Registration/department/${this.deleteDepartmentId}/`)
      .subscribe({
        next: (response: any) => {
          console.log('Department and associated users deleted successfully:', response);
          alert('Department and associated users deleted successfully!');
          this.deleteDepartmentId = '';
          this.showDeleteSection = false;
        },
        error: (error: any) => {
          if (error.status === 404) {
            alert("This department does not exist. Please enter a valid Department ID.");
          } else {
            console.error('Error deleting department:', error);
            alert('Failed to delete department. Please try again.');
          }
        }
      });
  }
}
