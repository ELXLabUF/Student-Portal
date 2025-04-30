import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private backendUrl = 'http://localhost:8000/api/improve-transcript';

  constructor(private http: HttpClient) {}

  improveTranscript(transcript: string): Observable<{ improvedTranscript: string }> {
    return this.http.post<{ improvedTranscript: string }>(
      this.backendUrl,
      { transcript: transcript }
    );
  }
}
