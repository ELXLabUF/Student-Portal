import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranscriptCardComponent } from '../../components/transcript-card/transcript-card.component';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience, NewExperience } from '../../experience';
import { AuthService } from '../../services/auth-service/auth.service';
import { AiService } from '../../services/ai-service/ai.service';

@Component({
  selector: 'app-student-transcripts',
  standalone: true,
  imports: [CommonModule, TranscriptCardComponent, FormsModule],
  template: `
    <div class="main-container">
      <h1> {{ user?.email }} </h1>
      <div class="transcript-list-container">
        <h1 class="page-header">My Stories</h1>
        <div class="transcript-list">
          <app-transcript-card
            *ngFor="let transcript of displayedTranscripts"
            [transcript]="transcript">
          </app-transcript-card>
        </div>
      </div>
      <div class="filter-container">
        <h2>Filter</h2>
        <div class="filter-controls">
          <!-- Dropdown for Topic -->
          <select [(ngModel)]="filterCapture">
            <option value="">All Captures</option>
            <option *ngFor="let capture of captures" [value]="capture">{{ capture }}</option>
          </select>
          <!-- Dropdown for Date -->
          <!-- <select [(ngModel)]="filterDate">
            <option value="">All Dates</option>
            <option *ngFor="let date of dates" [value]="date">{{ date }}</option>
          </select> -->
          <button (click)="applyFilter()">Filter</button>
          <button (click)="resetFilter()">Reset</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./student-transcripts.component.css'],
})
export class StudentTranscriptsComponent implements OnInit {
  topicName: string = 'My Stories';
  // allTranscripts: Array<{ id: string, device_id: string, capture: string; text: string; date: Date; imageUrl: string }> = [];
  // displayedTranscripts: Array<{ id: string, device_id: string, capture: string; text: string; date: Date; imageUrl: string }> = [];
  
  allTranscripts: NewExperience[] = [];
  displayedTranscripts: NewExperience[] = [];

  captures: string[] = [];
  filterCapture: string = '';

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private authService: AuthService
  ) {}

  user: any = null;

  ngOnInit(): void {
    this.experienceService.getExperiences().subscribe((experiences: NewExperience[]) => {
      this.allTranscripts = experiences.map(exp => ({
        id: exp.id,
        device_id: exp.device_id,
        capture: exp.capture,
        transcript: exp.transcript,
        creation_date: exp.creation_date,
        recording_path: exp.recording_path,
        show_to_teacher: exp.show_to_teacher,
        imageUrl: exp.imageUrl,
        edited: exp.edited,
      }))
      .sort((a, b) => b.creation_date.toDate().getTime() - a.creation_date.toDate().getTime());
      this.displayedTranscripts = this.allTranscripts;

      this.captures = Array.from(new Set(this.allTranscripts.map(t => t.capture)));
    });
  }

  applyFilter(): void {
    this.displayedTranscripts = this.allTranscripts.filter(item => {
      const matchesTopic = this.filterCapture
        ? item.capture === this.filterCapture
        : true;
      return matchesTopic;
    });
  }

  resetFilter(): void {
    this.filterCapture = '';
    this.displayedTranscripts = this.allTranscripts;
  }
}
