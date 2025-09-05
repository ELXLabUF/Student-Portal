import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Storage, getDownloadURL, listAll, ref } from '@angular/fire/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { TranscriptCardComponent } from '../../components/transcript-card/transcript-card.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NewExperience } from '../../experience';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-student-transcripts',
    imports: [FormsModule, CommonModule, TranscriptCardComponent],
    templateUrl: './student-transcripts.component.html',
    styleUrls: ['./student-transcripts.component.css'],
})
export class StudentTranscriptsComponent implements OnInit {
    private auth = getAuth();
    user = this.auth.currentUser;

    story: string = '';

    activeTranscript: NewExperience | null = null;

    topicName: string = 'My Stories';
    allTranscripts: NewExperience[] = [];
    displayedTranscripts: NewExperience[] = [];

    captures: string[] = [];
    filterCapture: string = '';

    showModal: boolean = false;
    activeCardId: string | null = null;
    uploadedImages: { url: string; name: string }[] = [];

    constructor(
        private storage: Storage,
        private experienceService: ExperienceService,
        public dialog: MatDialog
    ) {}

    async ngOnInit(): Promise<void> {
        this.experienceService
            .getExperiences()
            .subscribe((experiences: NewExperience[]) => {
                this.allTranscripts = experiences
                    .map((exp) => ({
                        id: exp.id,
                        device_id: exp.device_id,
                        capture: exp.capture,
                        transcript: exp.transcript,
                        translation: exp.translation,
                        original_transcript: exp.original_transcript,
                        creation_date: exp.creation_date,
                        recording_path: exp.recording_path,
                        show_to_teacher: exp.show_to_teacher,
                        imageUrl: exp.imageUrl,
                        uploadedImageUrl: exp.uploadedImageUrl,
                        edited: exp.edited,
                    }))
                    .sort(
                        (a, b) =>
                            b.creation_date.toDate().getTime() -
                            a.creation_date.toDate().getTime()
                    );
                this.displayedTranscripts = this.allTranscripts;

                this.captures = Array.from(
                    new Set(this.allTranscripts.map((t) => t.capture))
                );
            });

        this.user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user: any) => {
                unsubscribe(); // Unsubscribe immediately after getting the user
                resolve(user);
            });
        });

        if (this.user?.uid) {
            this.loadUserImages();
        }
    }

    loadUserImages() {
        const folderRef = ref(
            this.storage,
            `uploaded-images/${this.user?.uid}/`
        );

        listAll(folderRef)
            .then((res) => {
                this.uploadedImages = [];
                res.items.forEach((itemRef) => {
                    getDownloadURL(itemRef).then((url) => {
                        this.uploadedImages.push({
                            url: url,
                            name: itemRef.name,
                        });
                    });
                });
            })
            .catch((error) => {
                console.error('Error listing files:', error);
            });
    }

    applyFilter(): void {
        this.displayedTranscripts = this.allTranscripts.filter((item) => {
            const matchesTopic = this.filterCapture
                ? item.capture === this.filterCapture
                : true;
            return matchesTopic;
        });
    }

    resetFilter(): void {
        this.filterCapture = '';
        this.displayedTranscripts = this.allTranscripts;
    }

    openImageModal(transcriptId: string) {
        const matchedTranscript = this.allTranscripts.find(
            (item) => item.id === transcriptId
        );

        if (!matchedTranscript) {
            this.openAlertDialog('Error', 'Transcript not found.');
            return;
        }

        this.activeTranscript = matchedTranscript;

        if (
            matchedTranscript.uploadedImageUrl &&
            matchedTranscript.uploadedImageUrl !== ''
        ) {
            this.openAlertDialog(
                'Warning: Image Already Assigned',
                'The story already has an image assigned to it. Please try a different story.'
            );
            return;
        }

        this.showModal = true;
    }

    assignUploadedImage(url: string) {
        if (!this.activeTranscript) {
            this.openAlertDialog('Error', 'No transcript selected.');
            return;
        }

        this.openConfirmDialog(
            'Assign Image To Story',
            'Are you sure you want to assign this image to the story?'
        ).subscribe(async (decision: boolean) => {
            if (decision) {
                this.activeTranscript!.uploadedImageUrl = url;

                this.experienceService
                    .updateExperience(this.activeTranscript!, {
                        uploadedImageUrl: url,
                    })
                    .then(() => {
                        console.log('Firestore document updated successfully!');
                        //alert('Sent to teacher successfully!');
                        this.openAlertDialog(
                            'Success: Image Assigned To Story',
                            'The image you selected was assigned to the story successfully!'
                        );
                    })
                    .catch((err) => {
                        console.error(
                            'Failed to update Firestore document',
                            err
                        );
                        //alert('Failed to update Firestore document');
                        this.openAlertDialog(
                            'Failed: Image Not Assigned To Story',
                            'Failed to assign the image to the story. Please try again.'
                        );
                    });
            } else {
                return;
            }
        });

        this.showModal = false;
    }

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });
    }

    openConfirmDialog(title: string, message: string): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });

        return dialogRef.afterClosed();
    }
}
