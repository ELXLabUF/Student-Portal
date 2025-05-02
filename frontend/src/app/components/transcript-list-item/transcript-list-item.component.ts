import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai-service/ai.service';

@Component({
  selector: 'app-transcript-list-item',
  imports: [RouterLink, FormsModule, CommonModule],
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

  toggleEdit(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isEditing) {
      this.editedText = this.transcript.text;
      this.isEditing = true;
    }
  }

  saveTranscript(event: Event): void {
    event.stopPropagation();
    this.transcript.text = this.editedText;
    this.isEditing = false;
  }

  cancelEditing(event: Event): void {
    event.stopPropagation();
    this.isEditing = false;
  }

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
          this.aiService.generateImage(this.improvementPrompt).subscribe({
            next: (imgResponse) => {
              this.imageUrls = imgResponse.imageUrls;
              // Optionally, save one of the selected images to the transcript.
              // this.transcript.imageUrl = this.imageUrls[0];
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
