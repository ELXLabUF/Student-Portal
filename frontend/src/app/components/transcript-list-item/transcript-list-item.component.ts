import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai-service/ai.service';

@Component({
  selector: 'app-transcript-list-item',
  imports: [FormsModule, CommonModule],
  templateUrl: './transcript-list-item.component.html',
  styleUrls: ['./transcript-list-item.component.css'],
})
export class TranscriptListItemComponent {
  @Input() transcript!: { title: string; text: string; date: string; imageUrl?: string };

  isEditing: boolean = false;
  editedText: string = '';
  isExpanded: boolean = false;
  improvementPrompt: string = '';
  // Updated to store a list of image URLs
  imageUrls: string[] = [];

  constructor(private aiService: AiService) {}

  toggleExpand(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded && !this.improvementPrompt) {
      this.aiService.improveTranscript(this.transcript.text).subscribe({
        next: (response) => {
          this.improvementPrompt = response.improvementPrompt;
          // Now generate images using the improved transcript.
          // This call returns an array of image URLs.
          this.aiService.generateImage(this.transcript.text).subscribe({
            next: (imgResponse) => {
              this.imageUrls = imgResponse.imageUrls;
            },
            error: (imgErr) => {
              console.error('Error generating images', imgErr);
            },
          });
        },
        error: (err) => {
          console.error('Error improving transcript', err);
        },
      });
    }
  }
}
