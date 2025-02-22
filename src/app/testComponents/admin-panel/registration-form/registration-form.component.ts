import { Component, DebugElement } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']

})

export class RegistrationFormComponent {

  isFormSubmitted: boolean = false;

  //Creating user form object

  userForm: any =
    {
    fName: '',
    lName: '',
    userId: '',
    gender: '',
    department: '',
    dob: '',
    userPhoto: null,
  }

  //Submit function

  onSubmit(form: NgForm){
    
    this.isFormSubmitted = true;
    if(form.form.invalid){
      return;
    }
    const formValue = this.userForm;
    debugger;
    window.alert("Registration Successful");
    this.onReset();
    this.isFormSubmitted = false;
  }

   //Reset function
  onReset(){

    this.userForm.fName = '';
    this.userForm.lName = '';
    this.userForm.userId = '';
    this.userForm.gender = '';
    this.userForm.department = '';
    this.userForm.dob = '';
    this.userForm.userPhoto = null;
    this.isFormSubmitted = false;
  }   
}