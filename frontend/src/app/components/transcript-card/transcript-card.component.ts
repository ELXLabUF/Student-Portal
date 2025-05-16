import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai-service/ai.service';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience, NewExperience } from '../../experience';

@Component({
  selector: 'app-transcript-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './transcript-card.component.html',
  styleUrls: ['./transcript-card.component.css'],
})
export class TranscriptCardComponent {
  @Input() transcript!: NewExperience;

  isEditing: boolean = false;
  wasEdited: boolean = false;
  isExpanded: boolean = false;
  editedText: string = '';
  improvementPrompt: string = '';
  imageUrls: string[] = [];
  selectedImage: string | null = null;
  generatingImages: boolean = false;
  uploading: boolean = false;

  constructor(private aiService: AiService, private experienceService: ExperienceService) {}

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;

    // If collapsing the card, keep the edit state as is
    if (!this.isExpanded && this.isEditing) {
      return;
    }

    // If expanding the card, show the normal text if not editing
    if (this.isExpanded && !this.isEditing) {
      this.editedText = ''; // Reset the edited text
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.isExpanded = true; // Expand the card when entering edit mode
      this.editedText = this.transcript.transcript; // Pre-fill the text area

      // Call the improveTranscript function
      this.aiService.improveTranscript(this.transcript.transcript).subscribe({
        next: (response) => {
          this.improvementPrompt = response.improvementPrompt; // Display the improvement prompt
        },
        error: (err) => {
          console.error('Error improving transcript:', err);
          alert('Failed to generate improvement suggestions.');
        },
      });
    }
  }

  
  saveEdit(): void {
    if (!this.editedText.trim()) {
      alert('Transcript cannot be empty.');
      return;
    }
    
    // Update the transcript locally
    this.transcript.transcript = this.editedText;
    this.experienceService.updateExperience(this.transcript, { transcript: this.editedText })
    .then(() => {
      this.experienceService.updateExperience(this.transcript, { edited: true })
      console.log('Firestore document updated successfully!');
      alert('Transcript saved successfully!');
    })
    .catch((err) => {
      console.error('Failed to update Firestore document', err);
      alert('Failed to update Firestore document');
    });
    
    // Exit edit mode but keep the card expanded
    this.isEditing = false;
    this.wasEdited = true; // Mark as edited
  }
  
  cancelEdit(): void {
    this.isEditing = false; // Exit edit mode
    this.isExpanded = false;
    this.editedText = ''; // Clear the edited text
  }

  sendToTeacher(): void {
    this.transcript.show_to_teacher = true;
    this.experienceService.updateExperience(this.transcript, { show_to_teacher: true })
    .then(() => {
      console.log('Firestore document updated successfully!');
      alert('Sent to teacher successfully!');
    })
    .catch((err) => {
      console.error('Failed to update Firestore document', err);
      alert('Failed to update Firestore document');
    });
  }

  generateImages(): void {
    this.isExpanded = true; // Expand the card to show images
    if (this.imageUrls.length > 0) {
      console.log('Images already generated:', this.imageUrls);
      return;
    }
    this.aiService.generateImages(this.transcript.transcript).subscribe({
      next: (response) => {
        this.imageUrls = response.imageUrls; // Assuming the response contains an array of image URLs
        console.log('Generated images:', this.imageUrls);
      },
      error: (err) => {
        console.error('Error generating images:', err);
        alert('Failed to generate images.');
      },
    });
  }
  
  storeImage(url: string) {
    this.selectedImage = url;
    this.uploading = true;

    this.aiService.uploadImageToFirebase(url, this.transcript).subscribe({
      next: (res) => {
        console.log('Image uploaded:', res.firebaseUrl);
        this.transcript.imageUrl = res.firebaseUrl;

        // Update the Firestore document with the new imageUrl
        this.experienceService.updateExperience(this.transcript, { imageUrl: res.firebaseUrl })
          .then(() => {
            console.log('Firestore document updated successfully!');
            alert('Image saved successfully!');
          })
          .catch((err) => {
            console.error('Failed to update Firestore document', err);
            alert('Failed to update Firestore document');
          });
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
