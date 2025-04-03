import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-class-stories',
  imports: [CommonModule, CardComponent],
  template: `
    <h1>Class Stories</h1>
    <div class="flashcard-grid">
      <app-card
        *ngFor="let card of cards"
        [frontText]="card.frontText"
        [backText]="card.backText"
      ></app-card>
    </div>
  `,
  styleUrl: './class-stories.component.css',
})
export class ClassStoriesComponent {
  cards = [
    { frontText: 'Hello 1', backText: 'World 1' },
    { frontText: 'Hello 2', backText: 'World 2' },
    { frontText: 'Hello 3', backText: 'World 3' },
    { frontText: 'Hello 4', backText: 'World 4' },
    { frontText: 'Hello 5', backText: 'World 5' },
    { frontText: 'Hello 6', backText: 'World 6' },
    { frontText: 'Hello 7', backText: 'World 7' },
    { frontText: 'Hello 8', backText: 'World 8' },
  ];
}
