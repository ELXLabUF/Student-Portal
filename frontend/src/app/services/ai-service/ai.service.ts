import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  improveTranscript(transcript: string): Observable<{ improvementPrompt: string }> {
    return this.http.post<{ improvementPrompt: string }>(
      `${this.backendUrl}/api/improve-transcript`, 
      { transcript });
  }

  generateImage(transcript: string): Observable<{ imageUrls: string[] }> {
    return this.http.post<{ imageUrls: string[] }>(
      `${this.backendUrl}/api/generate-images`, 
      { transcript });
  }

  uploadImageToFirebase(url: string, transcript: any): Observable<{ firebaseUrl: string }> {
    return this.http.post<{ firebaseUrl: string }>(
      `${this.backendUrl}/api/upload-image`,
      { imageUrl: url, transcriptId: transcript.id, deviceId: transcript.device_id }
    );
  }
}
