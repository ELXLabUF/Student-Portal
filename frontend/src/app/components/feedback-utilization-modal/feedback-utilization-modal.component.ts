import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feedback-utilization-modal',
    templateUrl: './feedback-utilization-modal.component.html',
    styleUrls: ['./feedback-utilization-modal.component.css'],
    standalone: true,
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
})
export class FeedbackUtilizationModalComponent {
    selectedRating: number = 0;
    hoverRating: number = 0;

    constructor(
        public dialogRef: MatDialogRef<FeedbackUtilizationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { question: string }
    ) {}

    setRating(rating: number): void {
        this.selectedRating = rating;
    }

    setHoverRating(rating: number): void {
        this.hoverRating = rating;
    }

    resetHoverRating(): void {
        this.hoverRating = 0;
    }

    confirm(): void {
        if (this.selectedRating > 0) {
            this.dialogRef.close(this.selectedRating);
        }
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }
}
