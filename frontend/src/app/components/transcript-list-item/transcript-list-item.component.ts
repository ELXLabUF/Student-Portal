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
  improvedTranscript: string = '';
  imageUrl: string = '';

  constructor(private aiService: AiService) {}

  toggleEdit(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isEditing) {
      this.editedText = this.transcript.text;
      this.isEditing = !this.isEditing;
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

    if (this.isExpanded && !this.improvedTranscript) {
      this.aiService.improveTranscript(this.transcript.text).subscribe({
        next: (response) => {
          this.improvedTranscript = response.improvedTranscript;
          // Now that we have an improved transcript, call generateImage.
          if (!this.imageUrl) {
            this.aiService.generateImage(this.improvedTranscript).subscribe({
              next: (imgResponse) => {
                this.imageUrl = imgResponse.imageUrl;
                // Optionally save the imageUrl to transcript for future reference.
                //this.transcript.imageUrl = imgResponse.imageUrl;
              },
              error: (imgErr) => {
                console.error('Error generating image', imgErr);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error improving transcript', err);
        }
      });
    }
  }
}
