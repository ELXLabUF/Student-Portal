import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  // private improveTranscriptUrl = 'http://localhost:8000/api/improve-transcript';
  // private generateImageUrl = 'http://localhost:8000/api/generate-images';
  private backendUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  improveTranscript(transcript: string): Observable<{ improvementPrompt: string }> {
    return this.http.post<{ improvementPrompt: string }>(
      this.backendUrl + '/improve-transcript',
      { transcript: transcript }
    );
  }

  generateImage(transcript: string): Observable<{ imageUrls: string[] }> {
    return this.http.post<{ imageUrls: string[] }>(
      this.backendUrl + '/generate-images',
      { transcript: transcript }
    )
  }
}
