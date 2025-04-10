import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  // (only required imports for RouterLink if using standalone components)
  imports: [RouterLink],
  template: `
    <div class="card-container">
      <div class="card" [routerLink]="link">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-description">{{ description }}</p>
        <p class="card-date">{{ date }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.css'],
  standalone: true,
})
export class CardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() date!: string;
  // You can use either a string or an array to build dynamic links.
  @Input() link: any;
}
