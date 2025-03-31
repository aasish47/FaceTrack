import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

interface Camera {
  id?: number;
  name: string;
  type: 'entry' | 'exit';
  fps: number;
  url: string;
  operational: boolean;
  created_at?: string;
}

@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.css']
})
export class AddCameraComponent implements OnInit {
  cameras: Camera[] = [];
  newCamera: Camera = {
    name: '',
    type: 'entry',
    fps: 30,
    url: '',
    operational: false
  };

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.loadCameras();
  }

  loadCameras(): void {
    this.cameraService.getCameras().subscribe({
      next: (cameras) => this.cameras = cameras,
      error: (error) => console.error('Error loading cameras:', error)
    });
  }

  addCamera(): void {
    if (!this.newCamera.name.trim() || !this.newCamera.url.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    this.cameraService.addCamera(this.newCamera).subscribe({
      next: (response) => {
        this.cameras.push(response.camera);
        this.resetForm();
      },
      error: (error) => console.error('Error adding camera:', error)
    });
  }

  resetForm(): void {
    this.newCamera = {
      name: '',
      type: 'entry',
      fps: 30,
      url: '',
      operational: false
    };
  }

  deleteCamera(id: number): void {
    if (confirm('Are you sure you want to delete this camera?')) {
      this.cameraService.deleteCamera(id).subscribe({
        next: () => {
          this.cameras = this.cameras.filter(camera => camera.id !== id);
        },
        error: (error) => console.error('Error deleting camera:', error)
      });
    }
  }
}