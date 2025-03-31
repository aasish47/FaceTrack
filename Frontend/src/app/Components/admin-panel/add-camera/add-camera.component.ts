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
  cameras: any[] = [];
  newCamera = {
    name: '',
    type: 'entry' as 'entry' | 'exit',
    fps: 30,
    url: '',
    operational: false,
  };

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    this.loadCameras();
  }

  loadCameras() {
    this.cameraService.getCameras().subscribe(
      (cameras) => this.cameras = cameras,
      (error) => console.error('Error loading cameras:', error)
    );
  }

  addCamera() {
    this.cameraService.addCamera(this.newCamera).subscribe(
      (response) => {

        this.cameras.push(response.camera);
        this.resetForm();
      },
      (error) => console.error('Error adding camera:', error)
    );
  }

  resetForm() {
    this.newCamera = {
      name: '',
      type: 'entry',
      fps: 30,
      url: '',
      operational: false,
    };
  }

  deleteCamera(id: number) {
    if (confirm('Are you sure you want to delete this camera?')) {
      this.cameraService.deleteCamera(id).subscribe(
        (response) => {
          this.cameras = this.cameras.filter(camera => camera.id !== id);
        },
        (error) => {
          console.error('Error deleting camera:', error);
          
        }
      );
    }
  }
}