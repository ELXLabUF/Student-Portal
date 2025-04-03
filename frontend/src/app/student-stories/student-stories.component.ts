import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-stories',
  imports: [RouterLink],
  template: `
    <h1>My Stories</h1>
    <div class="flashcard-grid">
      <a routerLink="/gravity" class="story-card"></a>
      <a href="/" class="story-card"></a>
      <a href="/" class="story-card"></a>
      <a href="/" class="story-card"></a>
      <a href="/" class="story-card"></a>
      <a href="/" class="story-card"></a>
    </div>
  `,
  styleUrl: './student-stories.component.css',
})
export class StudentStoriesComponent {
}
