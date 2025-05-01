import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private improveTranscriptUrl = 'http://localhost:8000/api/improve-transcript'; // Adjust this URL to your backend endpoint
  private generateImageUrl = 'http://localhost:8000/api/generate-images'; // Adjust this URL to your backend endpoint

  constructor(private http: HttpClient) {}

  improveTranscript(transcript: string): Observable<{ improvedTranscript: string }> {
    return this.http.post<{ improvedTranscript: string }>(
      this.improveTranscriptUrl,
      { transcript: transcript }
    );
  }

  generateImage(transcript: string): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(
      this.generateImageUrl,
      { transcript: transcript }
    )
  }
}
