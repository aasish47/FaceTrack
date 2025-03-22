import { Component, DebugElement } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']

})

export class RegistrationFormComponent {
  constructor(private http: HttpClient) { }

  isFormSubmitted: boolean = false;

  //Creating user form object

  userForm: any =
    {
      userName: '',
      userId: '',
      userEmail: '',
      userDepartment: '',
      userDesignation: '',
      userPhoto: null,
    }

  //Submit function

  // onSubmit(form: NgForm){

  //   this.isFormSubmitted = true;
  //   if(form.form.invalid){
  //     return;
  //   }
  //   console.log("data : ",this.userForm.userPhoto);
  //   const formValue = this.userForm;
  //   debugger;
  //   this.http.post("http://127.0.0.1:8000/Registration/user/", formValue).subscribe(response => {
  //       console.log('User  registered successfully', response);
  //       window.alert("Registration Successful");
  //     }, error => {
  //       console.error('Error registering user', error);
  //     });
  //   this.onReset();
  //   this.isFormSubmitted = false;
  // }


  onSubmit(form: NgForm) {
    this.isFormSubmitted = true;

    if (!this.userForm.userPhoto) {
      window.alert("Please select an image before submitting.");
      return;
    }

    if (form.form.invalid) {
      return;
    }

    console.log("Data:", this.userForm.userPhoto);
    this.http.post("http://127.0.0.1:8000/Registration/user/", this.userForm)
      .subscribe(response => {
        console.log('User registered successfully', response);
        window.alert("Registration Successful");
        this.onReset();
      }, error => {
        console.error('Error registering user', error);
      });

    this.isFormSubmitted = false;
  }

  //Reset function
  onReset() {
    this.userForm.userName = '';
    this.userForm.userId = '';
    this.userForm.userDepartment = '';
    this.userForm.userDesignation = '';
    this.userForm.userEmail = '';
    this.userForm.userPhoto = null;
    this.isFormSubmitted = false;

    const fileInput = document.getElementById("userPhoto") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userForm.userPhoto = reader.result;
      };
    }
  }
}