import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranscriptCardComponent } from '../../components/transcript-card/transcript-card.component';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience, NewExperience } from '../../experience';
import { AuthService } from '../../services/auth-service/auth.service';

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
            <option value="">All Topics</option>
            <option *ngFor="let topic of topics" [value]="topic">{{ topic }}</option>
          </select>
          <!-- Dropdown for Date -->
          <select [(ngModel)]="filterDate">
            <option value="">All Dates</option>
            <option *ngFor="let date of dates" [value]="date">{{ date }}</option>
          </select>
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
  allTranscripts: Array<{ id: string, device_id: string, capture: string; text: string; date: string; imageUrl: string }> = [];
  displayedTranscripts: Array<{ id: string, device_id: string, capture: string; text: string; date: string; imageUrl: string }> = [];
  
  topics: string[] = [];
  dates: string[] = [];
  
  filterCapture: string = '';
  filterDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private authService: AuthService
  ) {}

  user: any = null;

  ngOnInit(): void {
    // if (this.authService.currentUser) {
    //   this.user = this.authService.currentUser;
    // };

    this.experienceService.getExperience().subscribe((experiences: NewExperience[]) => {
      this.allTranscripts = experiences.map(exp => ({
        id: exp.id,
        device_id: exp.device_id,
        capture: exp.capture,
        text: exp.transcript,
        date: exp.creation_date,
        imageUrl: 'assets/placeholder.png'
      }));
      // Set displayed transcripts initially
      this.displayedTranscripts = this.allTranscripts;

      // Extract unique topics (using title as the topic) and dates for dropdowns.
      this.topics = Array.from(
        new Set(this.allTranscripts.map(t => t.capture))
      );
      this.dates = Array.from(
        new Set(this.allTranscripts.map(t => t.date))
      );
    });
  }

  applyFilter(): void {
    this.displayedTranscripts = this.allTranscripts.filter(item => {
      const matchesTopic = this.filterCapture
        ? item.capture === this.filterCapture
        : true;
      const matchesDate = this.filterDate
        ? item.date === this.filterDate
        : true;
      return matchesTopic && matchesDate;
    });
  }

  resetFilter(): void {
    this.filterCapture = '';
    this.filterDate = '';
    this.displayedTranscripts = this.allTranscripts;
  }
}
