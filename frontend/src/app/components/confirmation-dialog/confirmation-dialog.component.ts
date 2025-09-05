import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    imports: [MatDialogModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
