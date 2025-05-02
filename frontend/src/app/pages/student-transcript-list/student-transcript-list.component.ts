import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranscriptListItemComponent } from '../../components/transcript-list-item/transcript-list-item.component';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience } from '../../experience';

@Component({
  selector: 'app-student-transcript-list',
  standalone: true,
  imports: [CommonModule, TranscriptListItemComponent, FormsModule],
  template: `
    <div class="main-container">
      <div class="transcript-list-container">
        <h1 class="page-header">My Stories</h1>
        <div class="transcript-list">
          <app-transcript-list-item
            *ngFor="let transcript of displayedTranscripts"
            [transcript]="transcript">
          </app-transcript-list-item>
        </div>
      </div>
      <div class="filter-container">
        <h2>Filter</h2>
        <div class="filter-controls">
          <!-- Dropdown for Topic -->
          <select [(ngModel)]="filterTopic">
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
  styleUrls: ['./student-transcript-list.component.css'],
})
export class StudentTranscriptListComponent implements OnInit {
  topicName: string = 'My Stories';
  allTranscripts: Array<{ title: string; text: string; date: string; imageUrl: string }> = [];
  displayedTranscripts: Array<{ title: string; text: string; date: string; imageUrl: string }> = [];
  
  topics: string[] = [];
  dates: string[] = [];
  
  filterTopic: string = '';
  filterDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    this.experienceService.getExperience().subscribe((experiences: Experience[]) => {
      this.allTranscripts = experiences.map(exp => ({
        title: exp.experience_title,
        text: exp.experience_description,
        date: exp.date,
        imageUrl: 'assets/placeholder.png'
      }));
      // Set displayed transcripts initially
      this.displayedTranscripts = this.allTranscripts;

      // Extract unique topics (using title as the topic) and dates for dropdowns.
      this.topics = Array.from(
        new Set(this.allTranscripts.map(t => t.title))
      );
      this.dates = Array.from(
        new Set(this.allTranscripts.map(t => t.date))
      );
    });
  }

  applyFilter(): void {
    this.displayedTranscripts = this.allTranscripts.filter(item => {
      const matchesTopic = this.filterTopic
        ? item.title === this.filterTopic
        : true;
      const matchesDate = this.filterDate
        ? item.date === this.filterDate
        : true;
      return matchesTopic && matchesDate;
    });
  }

  resetFilter(): void {
    this.filterTopic = '';
    this.filterDate = '';
    this.displayedTranscripts = this.allTranscripts;
  }
}
