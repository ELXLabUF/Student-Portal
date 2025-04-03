import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flashcard',
  template: `
    <div class="flashcard-container" (click)="toggleFlip()">
      <div class="flashcard" [class.flipped]="isFlipped">
        <div class="front">
          <img
            [src]="frontImage"
            alt="Generated Image"
          />
        </div>
        <div class="back">
          <p>{{ backText }}</p>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
})
export class FlashcardComponent {
  @Input() frontImage: string = '';
  @Input() backText: string = 'Description';

  isFlipped: boolean = false;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
