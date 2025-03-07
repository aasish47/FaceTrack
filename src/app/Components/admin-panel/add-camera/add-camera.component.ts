import { Component } from '@angular/core';
interface Camera {
  name: string; 
  type: 'entry' | 'exit';
  fps: number;
  url: string;
  operational: boolean;
}

@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.css']
})
export class AddCameraComponent {
  cameras: Camera[] = [];
  newCamera = {
    name: '', 
    type: 'entry' as 'entry' | 'exit',
    fps: 30,
    url: '',
    operational: false,
  };

  addCamera() {
    // Simulate camera operational status
    const camera: Camera = {
      name: this.newCamera.name, 
      type: this.newCamera.type,
      fps: this.newCamera.fps,
      url: this.newCamera.url,
      operational: true, // Assume the camera is operational after adding
    };
    this.cameras.push(camera);

    // Reset the form
    this.newCamera = {
      name: '', 
      type: 'entry',
      fps: 30,
      url: '',
      operational: false,
    };
  }
}