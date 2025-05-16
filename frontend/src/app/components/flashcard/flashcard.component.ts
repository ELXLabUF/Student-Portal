import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  imports: [],
  template: `
    <div
      class="flashcard-container"
      [class.flipped]="isFlipped"
      (click)="toggleFlip()"
    >
      <div class="flashcard">
        <div class="front"><img class="front-image" [src]="frontImage" alt="AI-Generated Image"></div>
        <div class="back">{{ backText }}</div>
      </div>
    </div>
  `,
  styleUrl: './flashcard.component.css',
})
export class FlashcardComponent {
  @Input() frontImage: string = '';
  @Input() backText: string = '';
  
  isFlipped: boolean = false;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
