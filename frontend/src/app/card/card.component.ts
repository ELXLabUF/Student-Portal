import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div
      class="flashcard-container"
      [class.flipped]="isFlipped"
      (click)="toggleFlip()"
    >
      <div class="flashcard">
        <div class="front">{{ frontText }}</div>
        <div class="back">{{ backText }}</div>
      </div>
    </div>
  `,
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() frontText: string = '';
  @Input() backText: string = 'Back';
  
  isFlipped: boolean = false;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
