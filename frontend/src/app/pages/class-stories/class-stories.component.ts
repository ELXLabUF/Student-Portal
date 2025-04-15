import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardComponent } from '../../components/flashcard/flashcard.component';

@Component({
  selector: 'app-class-stories',
  imports: [CommonModule, FlashcardComponent],
  template: `
    <h1>Class Stories</h1>
    <div class="flashcard-grid">
      @for (card of cards; track card.cardId) {
      <app-flashcard
        [frontImage]="card.frontImage"
        [backText]="card.backText"
      ></app-flashcard>
      }
    </div>
  `,
  styleUrl: './class-stories.component.css',
})
export class ClassStoriesComponent {
  cards = [
    { cardId: 0,frontImage: 'https://files09.oaiusercontent.com/file-RnstVLJp6686ERCBvSztpS?se=2025-04-11T06%3A35%3A38Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D2aa491e1-e9e6-47c8-a08e-eebbfedaa6f8.webp&sig=hXdm8HlxbRPSkhuw1k6MYH6E%2BqIUi8BNXyD7D6F0y8o%3D', backText: 'Transcript Text' },
    { cardId: 1,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 2,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 3,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 4,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 5,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 6,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
    { cardId: 7,frontImage: 'assets/placeholder.png', backText: 'Transcript Text' },
  ];
}
