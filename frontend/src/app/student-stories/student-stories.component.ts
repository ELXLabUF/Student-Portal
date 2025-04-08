import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-student-stories',
  imports: [RouterLink, CardComponent, CommonModule],
  template: `
    <h1>Capture Periods</h1>
    <div class="card-grid">
      <app-card
        *ngFor="let topic of topics"
        [title]="topic.name"
        [description]="topic.description"
        [link]="topic.link"
      ></app-card>
    </div>
  `,
  styleUrl: './student-stories.component.css',
})
export class StudentStoriesComponent {
  topics = [
    {
      name: 'Gravity',
      description:
        'The force that attracts a body toward the center of the earth.',
      link: ''
    },
    {
      name: 'Friction',
      description:
        'The resistance that one surface or object encounters when moving over another.',
      link: ''
    },
    { name: 'General', 
      description: 'A general overview of the topic.',
      link: ''
    },
  ];
}
