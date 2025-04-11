import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  template: `
    <div class="card-container">
      <div class="card" [routerLink]="[link, id]">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-date">{{ date }}</p>
        <p class="card-description">{{ description }}</p>
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
  @Input() id!: number;
  // You can use either a string or an array to build dynamic links.
  @Input() link: any;
}
