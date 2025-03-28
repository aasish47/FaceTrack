import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-wfh-request',
  templateUrl: './wfh-request.component.html',
  styleUrls: ['./wfh-request.component.css']
})
export class WfhRequestComponent implements OnInit {
  wfhForm!: FormGroup;
  userId!: number;
  userData: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.initForm();

    this.userService.getUserDetails(this.userId).subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        alert('Error loading user details.');
      }
    });
  }

  initForm() {
    this.wfhForm = this.fb.group({
      type: ['', Validators.required],
      date: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.wfhForm.valid && this.userData) {
      const formData = {
        ...this.wfhForm.value,
        userId: this.userId,
        name: this.userData.userName,
        email: this.userData.userEmail,
        department: this.userData.userDepartment,
        designation: this.userData.userDesignation
      };

      this.http.post('http://127.0.0.1:8000/api/send-email/', formData).subscribe({
        next: () => {
          alert('WFH request submitted and email sent!');
          this.wfhForm.reset();
        },
        error: (error) => {
          alert('Failed to send WFH request.');
          console.error('Error:', error);
        }
      });
    } else {
      alert('Please fill all required fields.');
    }
  }
}
