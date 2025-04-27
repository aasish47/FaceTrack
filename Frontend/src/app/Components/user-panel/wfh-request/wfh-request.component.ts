import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-wfh-request',
  templateUrl: './wfh-request.component.html',
  styleUrls: ['./wfh-request.component.css']
})
export class WfhRequestComponent implements OnInit {
  wfhForm!: FormGroup;
  userId!: number;
  userData: any;
  today: string | undefined;
  
  loading = false;
  loadingStatus: 'loading' | 'success' | 'error' = 'loading';
  loadingMessage = 'Processing your request...';
  loadingProgress = 0;
  loadingSuccessMessage = 'Request submitted successfully!';
  loadingErrorMessage = 'An error occurred while submitting your request';
  submissionProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUserData();
  }

  private initializeForm(): void {
    this.wfhForm = this.fb.group({
      type: ['', Validators.required],
      date: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  private fetchUserData(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    
    this.userService.getUserDetails(this.userId).subscribe({
      next: (data) => this.userData = data,
      error: (err) => this.handleUserDataError(err)
    });
  }

  onSubmit(): void {
    if (this.wfhForm.invalid || !this.userData || this.loading) return;

    this.loading = true;
    this.submissionProgress = 0;
    const formData = this.prepareFormData();

    const progressInterval = setInterval(() => {
      this.submissionProgress = Math.min(this.submissionProgress + 10, 90);
    }, 200);
    
    this.http.post('http://127.0.0.1:8000/api/send-email/', formData).subscribe({
      next: () => this.handleSubmissionSuccess(),
      error: (err) => this.handleSubmissionError(err)
    });
  }

  private prepareFormData(): any {
    return {
      ...this.wfhForm.value,
      userId: this.userId,
      name: this.userData.userName,
      email: this.userData.userEmail,
      department: this.userData.userDepartment,
      designation: this.userData.userDesignation
    };
  }

  private handleSubmissionSuccess(): void {
    // this.loading = false;
    // this.showAlert('Request submitted successfully!', 'success');
    this.loadingStatus = 'success';
    this.loadingMessage = 'Almost done...';
    setTimeout(() => {
      this.loading = false;
  }, 1500);
    this.wfhForm.reset();
  }

  private handleSubmissionError(error: any): void {
    // this.loading = false;
    // this.showAlert('Submission failed. Please try again.', 'error');
    this.loadingStatus = 'error';
    this.loadingMessage = 'Almost done...';
    setTimeout(() => {
      this.loading = false;
    }, 1500);
    console.error('Submission error:', error);
  }

  private handleUserDataError(error: any): void {
    this.loading = false;
    this.showAlert('Error loading user details.', 'error');
    console.error('User data error:', error);
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    alert(message);
  }

  get formControls() {
    return this.wfhForm.controls;
  }
}
