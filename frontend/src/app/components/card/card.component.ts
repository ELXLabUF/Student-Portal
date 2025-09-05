import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-card',
    imports: [RouterLink],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    //standalone: true,
})
export class CardComponent {
    @Input() title!: string;
    @Input() description!: string;
    @Input() date!: string;
    @Input() id!: number;
    // You can use either a string or an array to build dynamic links.
    @Input() link: any;
}
