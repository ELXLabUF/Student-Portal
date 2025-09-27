import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
        @Inject(MAT_DIALOG_DATA) public data: { question: string },
        private userInteractionService: UserInteractionService
    ) {}

    setRating(rating: number): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            'Feedback utilization rating dot',
            `Selected rating: ${rating}`
        );

        this.selectedRating = rating;
    }

    setHoverRating(rating: number): void {
        this.hoverRating = rating;
    }

    resetHoverRating(): void {
        this.hoverRating = 0;
    }

    confirm(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Confirm' button on feedback utilization modal",
            `Confirmed rating of ${this.selectedRating}`
        );

        if (this.selectedRating > 0) {
            this.dialogRef.close(this.selectedRating);
        }
    }

    onCancel(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Cancel' button on feedback utilization modal",
            'Closed modal without confirming rating'
        );

        this.dialogRef.close(null);
    }
}
