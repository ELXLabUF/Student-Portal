import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transcript-list-item',
  imports: [RouterLink],
  template: `
    <div class="transcript-item">
      <img
        class="transcript-image"
        [src]="transcript.imageUrl"
        alt="Transcript Preview"
      />
      <div class="transcript-info">
        <h2 class="transcript-title">{{ transcript.title }}</h2>
        <p class="transcript-text">{{ transcript.text }}</p>
      </div>
    </div>
  `,
  styleUrl: './transcript-list-item.component.css',
})
export class TranscriptListItemComponent {
  @Input() transcript!: { title: string; text: string; imageUrl: string };
}
