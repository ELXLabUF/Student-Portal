import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranscriptListItemComponent } from '../../components/transcript-list-item/transcript-list-item.component';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience } from '../../experience'; // Use the Experience interface

@Component({
  selector: 'app-student-transcript-list',
  imports: [CommonModule, TranscriptListItemComponent],
  template: `
    <div class="transcript-list-container">
      <h1 class="page-header">My Stories</h1>
      <div class="transcript-list">
          <app-transcript-list-item
            *ngFor="let transcript of transcripts"
            [transcript]="transcript">
          </app-transcript-list-item>
      </div>
    </div>
  `,
  styleUrls: ['./student-transcript-list.component.css'],
})
export class StudentTranscriptListComponent implements OnInit {
  topicName: string = 'My Stories';
  transcripts: Array<{ title: string; text: string; date: string, imageUrl: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    // Optionally, you can still use route params for filtering
    const captureIdStr = this.route.snapshot.paramMap.get('captureId');
    const captureId = captureIdStr ? parseInt(captureIdStr, 10) : 0;
    
    // Subscribe to the experiences observable
    this.experienceService.getExperience().subscribe((experiences: Experience[]) => {
      // Map each Experience to transcript object expected by transcript-list-item.
      this.transcripts = experiences.map(exp => ({
        title: exp.experience_title,
        text: exp.experience_description,
        date: exp.date,
        // Use a default placeholder or compute an imageUrl from exp.student_data if needed.
        imageUrl: 'assets/placeholder.png'
      }));
    });
  }
}
