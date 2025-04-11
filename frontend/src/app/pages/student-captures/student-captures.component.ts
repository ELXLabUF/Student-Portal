import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-student-captures',
  imports: [RouterLink, CardComponent, CommonModule],
  template: `
    <h1>Capture Periods</h1>
    <div class="card-grid">
      @for (capture of captures; track capture.id) {
        <app-card
          [title]="capture.name"
          [description]="capture.description"
          [date]="capture.date"
          [link]="capture.link"
          [id]="capture.id"
        ></app-card>
      }
    </div>
  `,
  styleUrl: './student-captures.component.css',
})
export class StudentCapturesComponent {
  captures = [
    {
      id: 0,
      name: 'Gravity',
      description: 'The force that attracts a body toward the center of the earth.',
      date: '01/01/2025 - 01/14/2025',
      link: '/transcripts'
    },
    {
      id: 1,
      name: 'Friction',
      description: 'The resistance that one surface or object encounters when moving over another.',
      date: '02/01/2025 - 02/14/2025',
      link: '/transcripts'
    },
    { 
      id: 2,
      name: 'General', 
      description: 'A general overview of the topic.',
      date: '03/01/2025 - 03/14/2025',
      link: '/transcripts'
    },
  ];
}
