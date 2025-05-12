import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AiService } from '../../services/ai-service/ai.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-transcript-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './transcript-card.component.html',
  styleUrls: ['./transcript-card.component.css'],
})
export class TranscriptCardComponent {
  @Input() transcript!: { id: string, device_id: string, capture: string; text: string; date: string; imageUrl?: string };

  isEditing: boolean = false;
  editedText: string = '';
  isExpanded: boolean = false;
  improvementPrompt: string = '';
  imageUrls: string[] = [];

  constructor(private aiService: AiService) {}

  toggleExpand(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isExpanded = !this.isExpanded;

    const button = document.getElementById('expand-btn');
    
    if (button) {
      if (this.isExpanded) {
        button.innerHTML = 'expand_less';
      }
      else {
        button.innerHTML = 'expand_more';
      }
    }

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

  selectedImage: string | null = null;
  uploading: boolean = false;

  storeImage(url: string) {
    this.selectedImage = url;
    this.uploading = true;

    this.aiService.uploadImageToFirebase(url, this.transcript).subscribe({
      next: (res) => {
        console.log('Image uploaded:', res.firebaseUrl);
        alert('Image saved successfully!');
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Failed to upload image');
      },
      complete: () => {
        this.uploading = false;
      }
    });
  }
}
