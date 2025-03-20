// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-attendance',
//   templateUrl: './attendance.component.html',
//   styleUrls: ['./attendance.component.css']
// })
// export class AttendanceComponent {

// }




import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  videoStream: MediaStream | null = null;
  captureInterval: any;
  private apiUrl = 'http://localhost:8000/api/upload-image/'; // Django API URL

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoStream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.startCapturing();
      })
      .catch(err => console.error('Error accessing camera:', err));
  }

  startCapturing() {
    this.captureInterval = setInterval(() => {
      this.captureImage();
    }, 3000); // Capture every 3 seconds
  }

  captureImage() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const formData = new FormData();
        formData.append('image', blob, 'capture.png');
        console.log(formData);
        this.sendImageToBackend(formData);
      }
    }, 'image/png');
  }

  sendImageToBackend(formData: FormData) {
    this.http.post(this.apiUrl, formData).subscribe({
      next: (response) => console.log('Image sent successfully', response),
      error: (error) => console.error('Error sending image:', error)
    });
  }

  ngOnDestroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    clearInterval(this.captureInterval);
  }
}