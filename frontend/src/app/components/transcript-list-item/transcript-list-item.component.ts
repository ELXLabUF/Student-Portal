// import { Component, Input } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-transcript-list-item',
//   imports: [RouterLink],
//   template: `
//     <div class="transcript-item">
//       <img
//         class="transcript-image"
//         [src]="transcript.imageUrl"
//         alt="Transcript Preview"
//       />
//       <div class="transcript-info">
//         <h2 class="transcript-title">{{ transcript.title }}</h2>
//         <p class="transcript-text">{{ transcript.text }}</p>
//       </div>
//     </div>
//   `,
//   styleUrl: './transcript-list-item.component.css',
// })
// export class TranscriptListItemComponent {
//   @Input() transcript!: { title: string; text: string; imageUrl: string };
// }
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transcript-list-item',
  // Include RouterLink and FormsModule so we can use ngModel for two-way binding.
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="transcript-item" (click)="toggleEdit()" [class.editing]="isEditing">
      <img
        class="transcript-image"
        [src]="transcript.imageUrl"
        alt="Transcript Preview"
      />
      <div class="transcript-info">
        <h2 class="transcript-title">{{ transcript.title }}</h2>
        <!-- Display preview when NOT editing -->
        <ng-container *ngIf="!isEditing; else editTemplate">
          <p class="transcript-text">{{ transcript.text }}</p>
        </ng-container>
        <!-- Editing Template -->
        <ng-template #editTemplate>
          <textarea
            class="transcript-textarea"
            [(ngModel)]="editedText"
            rows="3">
          </textarea>
          <div class="edit-buttons">
            <button class="save-btn" (click)="saveTranscript($event)">Save</button>
            <button class="cancel-btn" (click)="cancelEditing($event)">Cancel</button>
          </div>
        </ng-template>
      </div>
      <!-- Edit icon displayed at the top-right corner -->
      <button class="edit-icon" (click)="toggleEdit($event)">
        &#9998;
      </button>
    </div>
  `,
  styleUrls: ['./transcript-list-item.component.css'],
})
export class TranscriptListItemComponent {
  @Input() transcript!: { title: string; text: string; imageUrl: string };

  // Controls whether we are in editing mode
  isEditing: boolean = false;
  // A temporary variable to hold the edited transcript text
  editedText: string = '';

  /**
   * When toggling edit mode, we need to stop propagation so that
   * clicking the icon doesn't also trigger a parent click event.
   */
  toggleEdit(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    // If we're entering edit mode, initialize editedText with the current transcript text.
    if (!this.isEditing) {
      this.editedText = this.transcript.text;
      this.isEditing = !this.isEditing;
    }
  }

  saveTranscript(event: Event): void {
    event.stopPropagation();
    // Update the transcript text with the edited text
    this.transcript.text = this.editedText;
    this.isEditing = false;
  }

  cancelEditing(event: Event): void {
    event.stopPropagation();
    // Simply exit the edit mode without saving changes
    this.isEditing = false;
  }
}
