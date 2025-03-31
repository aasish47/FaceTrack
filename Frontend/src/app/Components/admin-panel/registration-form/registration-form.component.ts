import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  constructor(private http: HttpClient) { }

  isFormSubmitted: boolean = false;

  userForm = {
    userName: '',
    userId: '',
    userEmail: '',
    userDepartment: '',
    userDesignation: '',
    userPhoto: null as string | ArrayBuffer | null
  };

  onSubmit(form: NgForm): void {
    this.isFormSubmitted = true;

    if (!this.userForm.userPhoto) {
      alert("Please upload a profile photo before submitting.");
      return;
    }

    if (form.invalid) {
      return;
    }

    this.http.post("http://127.0.0.1:8000/Registration/user/", this.userForm)
      .subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          alert("Registration Successful!");
          this.onReset();
        },
        error: (error) => {
          console.error('Error registering user', error);
          alert("Registration failed. Please try again.");
        }
      });
  }

  onReset(): void {
    this.userForm = {
      userName: '',
      userId: '',
      userEmail: '',
      userDepartment: '',
      userDesignation: '',
      userPhoto: null
    };
    this.isFormSubmitted = false;

    const fileInput = document.getElementById("userPhoto") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
      const fileNameElement = document.getElementById("file-name");
      if (fileNameElement) {
        fileNameElement.textContent = "Choose a file...";
      }
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileNameElement = document.getElementById("file-name");
      if (fileNameElement) {
        fileNameElement.textContent = file.name;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userForm.userPhoto = reader.result;
      };
    }
  }
}