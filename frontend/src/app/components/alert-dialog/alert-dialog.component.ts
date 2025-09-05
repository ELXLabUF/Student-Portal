import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

@Component({
    selector: 'app-alert-dialog',
    imports: [MatDialogModule],
    templateUrl: './alert-dialog.component.html',
    styleUrl: './alert-dialog.component.css',
})
export class AlertDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
