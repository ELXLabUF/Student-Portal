import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-flashcard',
    imports: [],
    templateUrl: './flashcard.component.html',
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
