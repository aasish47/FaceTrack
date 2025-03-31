import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Camera {
    id?: number;
    name: string;
    type: 'entry' | 'exit';
    fps: number;
    url: string;
    operational: boolean;
    created_at?: string;
  }
  
  interface CameraResponse {
    message: string;
    camera: Camera;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class CameraService {
    private apiUrl = 'http://localhost:8000/api/cameras/';
  
    constructor(private http: HttpClient) { }
  
    getCameras(): Observable<Camera[]> {
      return this.http.get<Camera[]>(this.apiUrl);
    }
  
    addCamera(camera: Camera): Observable<CameraResponse> {
      return this.http.post<CameraResponse>(this.apiUrl, camera);
    }
  
    updateCamera(id: number, camera: Camera): Observable<CameraResponse> {
      return this.http.put<CameraResponse>(`${this.apiUrl}${id}/`, camera);
    }
  
    deleteCamera(id: number): Observable<{message: string, id?: number}> {
        return this.http.delete<{message: string, id?: number}>(`${this.apiUrl}${id}/`);
      }
  }