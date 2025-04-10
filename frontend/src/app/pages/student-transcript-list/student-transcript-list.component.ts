import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-transcript-list',
  imports: [CommonModule],
  template: `
    <div class="transcript-list-container">
      <!-- Topic/Capture Period Title -->
      <h1 class="topic-header">{{ topicName }}</h1>

      <!-- List of Transcript Items -->
      <div class="transcript-item" *ngFor="let transcript of transcripts">
        <img
          class="transcript-image"
          [src]="transcript.imageUrl"
          alt="Transcript Preview"
        />
        <div class="transcript-info">
          <h2 class="transcript-title">{{ transcript.title }}</h2>
          <p class="transcript-preview">{{ transcript.preview }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './student-transcript-list.component.css',
})
export class StudentTranscriptListComponent {
  @Input() topicName: string = 'Topic Name';

  transcripts = [
    {
      title: 'Transcript Title 1',
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      imageUrl: 'assets/placeholder.png'  // Replace with your image path
    },
    {
      title: 'Transcript Title 2',
      preview: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      imageUrl: 'assets/placeholder.png'
    },
    {
      title: 'Transcript Title 3',
      preview: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco...',
      imageUrl: 'assets/placeholder.png'
    }
  ];

}
