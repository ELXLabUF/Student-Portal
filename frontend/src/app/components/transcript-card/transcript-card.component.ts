import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth } from 'firebase/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AiService } from '../../services/ai-service/ai.service';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { NewExperience } from '../../experience';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-transcript-card',
    imports: [FormsModule, CommonModule],
    templateUrl: './transcript-card.component.html',
    styleUrls: ['./transcript-card.component.css'],
})
export class TranscriptCardComponent implements OnChanges {
    private auth = getAuth();
    user = this.auth.currentUser;

    @Input() transcript!: NewExperience;
    @Output() openImageModal = new EventEmitter<string>();

    isEditing: boolean = false;
    wasEdited: boolean = false;
    isExpanded: boolean = false;
    editedText: string = '';
    improvementPrompt: string = '';
    imageUrls: string[] = [];
    selectedImage: string | null = null;
    generatingImages: boolean = false;
    uploading: boolean = false;

    originalTranscriptText: string = '';
    feedbackRatingValue: number = 0;
    hoverRatingValue: number | null = null;
    hasRated: boolean = false;

    constructor(
        private angularFireStore: Firestore,
        private aiService: AiService,
        private experienceService: ExperienceService,
        public dialog: MatDialog
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['transcript'] && this.transcript) {
            this.feedbackRatingValue = this.transcript.feedback_rating || 0;
            this.hasRated = this.feedbackRatingValue > 0;
        }
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;

        // If collapsing the card, keep the edit state as is
        if (!this.isExpanded && this.isEditing) {
            return;
        }

        // If expanding the card, show the normal text if not editing
        if (this.isExpanded && !this.isEditing) {
            this.editedText = ''; // Reset the edited text
        }
    }

    async toggleEdit(): Promise<void> {
        this.isEditing = !this.isEditing;

        if (this.isEditing) {
            this.isExpanded = true; // Expand the card when entering edit mode
            this.editedText = this.transcript.transcript; // Pre-fill the text area
            this.originalTranscriptText = this.transcript.transcript;

            // Call the improveTranscript function
            if (this.transcript.ai_feedback) {
                this.improvementPrompt = this.transcript.ai_feedback;
                this.hasRated = !!this.transcript.feedback_rating;
            } else {
                this.aiService
                    .improveTranscript(this.transcript.transcript)
                    .subscribe({
                        next: async (response) => {
                            this.improvementPrompt = response.improvementPrompt; // Display the improvement prompt
                            await this.experienceService
                                .updateExperience(this.transcript, {
                                    ai_feedback: response.improvementPrompt,
                                })
                                .then(() => {
                                    this.transcript.ai_feedback =
                                        response.improvementPrompt;
                                    this.hasRated = false;
                                });
                        },
                        error: (err) => {
                            console.error('Error improving transcript:', err);
                            //alert('Failed to generate improvement suggestions.');
                            this.openAlertDialog(
                                'Failed: Improvement Suggestions Not Generated',
                                'Failed to generate improvement suggestions. Please try again.'
                            );
                        },
                    });
            }
        } else {
            this.isExpanded = false;
        }
    }

    async saveEdit(): Promise<void> {
        if (!this.editedText.trim()) {
            this.openAlertDialog(
                'Warning: Missing Text',
                'The story text cannot be empty. Please enter some text and try again.'
            );
            return;
        }

        const hasTextChanged = this.editedText !== this.originalTranscriptText;

        const experienceDocRef = doc(
            this.angularFireStore,
            `NewExperiences/${this.transcript.id}`
        );

        try {
            const docSnap = await getDoc(experienceDocRef);

            let originalTranscriptNeedsSet = false;
            if (docSnap.exists()) {
                const originalTranscriptInDb =
                    docSnap.data()?.['original_transcript'];
                if (!originalTranscriptInDb || originalTranscriptInDb === '') {
                    originalTranscriptNeedsSet = true;
                }
            }

            const updates: any = {
                transcript: this.editedText,
                translation: this.editedText,
                edited: true,
            };

            if (originalTranscriptNeedsSet) {
                updates.original_transcript =
                    this.transcript.translation || this.editedText;
            }

            if (hasTextChanged && this.transcript.ai_feedback) {
                let prevArray = this.transcript.previous_feedback || [];

                prevArray.push({
                    ai_feedback: this.transcript.ai_feedback,
                    feedback_rating: this.transcript.feedback_rating ?? 0,
                });

                // Save to Firestore without generating new feedback now
                updates.previous_feedback = prevArray;
                updates.feedback_rating = null;
                updates.ai_feedback = null;
            }

            await this.experienceService.updateExperience(
                this.transcript,
                updates
            );

            Object.assign(this.transcript, updates);
            this.improvementPrompt = hasTextChanged
                ? ''
                : updates.ai_feedback || this.improvementPrompt;
            this.hasRated = false;

            this.originalTranscriptText =
                this.transcript.original_transcript ||
                this.originalTranscriptText;
            this.originalTranscriptText = this.editedText;

            this.editedText = '';
            this.isEditing = false;
            this.wasEdited = true;
            this.isExpanded = true;

            this.openAlertDialog(
                'Success: Story Saved',
                'The story was saved successfully!'
            );
        } catch (err) {
            console.error('Failed to update Firestore document', err);
            this.openAlertDialog(
                'Failed: Story Not Saved',
                'The story was not saved successfully. Please try again.'
            );
        }
    }

    cancelEdit(): void {
        this.isEditing = false; // Exit edit mode
        this.isExpanded = false;
        this.editedText = ''; // Clear the edited text
    }

    sendToTeacher(): void {
        // Check if an image was selected for this story
        //if (this.transcript.imageUrl === '') {
        //    //alert('Please select an image before sending to teacher.');
        //    this.openAlertDialog(
        //        'Warning: No Image Selected',
        //        'Please select an image for the story before sending to teacher.'
        //    );
        //    return;
        //}

        if (this.transcript.show_to_teacher) {
            this.openAlertDialog(
                'Info: Story Already Sent',
                'This story has already been sent to your teacher.'
            );
            return;
        }

        this.openConfirmDialog(
            'Send Story To Teacher',
            'Are you sure you want to send this story to your teacher?'
        ).subscribe(async (decision: boolean) => {
            if (decision) {
                this.transcript.show_to_teacher = true;

                this.experienceService
                    .updateExperience(this.transcript, {
                        show_to_teacher: true,
                    })
                    .then(() => {
                        console.log('Firestore document updated successfully!');
                        this.openAlertDialog(
                            'Success: Story Sent To Teacher',
                            'The story was sent to your teacher successfully!'
                        );
                    })
                    .catch((err) => {
                        console.error(
                            'Failed to update Firestore document',
                            err
                        );
                        this.openAlertDialog(
                            'Failed: Story Not Sent To Teacher',
                            'Failed to send the story to your teacher. Please try again.'
                        );
                    });
            } else {
                return;
            }
        });
    }

    async onFeedbackRefresh(): Promise<void> {
        // Store current prompt and its rating as a previous feedback
        let prevArray = this.transcript.previous_feedback || [];
        if (this.transcript.ai_feedback) {
            prevArray.push({
                ai_feedback: this.transcript.ai_feedback,
                feedback_rating: this.transcript.feedback_rating ?? 0,
            });
        }
        // Reset feedback and rating fields in Firestore
        await this.experienceService.updateExperience(this.transcript, {
            previous_feedback: prevArray,
            ai_feedback: null,
            feedback_rating: null,
        });

        // Call backend for new feedback
        this.aiService.improveTranscript(this.transcript.transcript).subscribe({
            next: async (response) => {
                this.improvementPrompt = response.improvementPrompt;
                await this.experienceService.updateExperience(this.transcript, {
                    ai_feedback: response.improvementPrompt,
                    feedback_rating: null,
                });
                this.transcript.ai_feedback = response.improvementPrompt;
                this.transcript.feedback_rating = null;
                this.hasRated = false;
            },
            error: (err) => {
                this.openAlertDialog(
                    'Failed: Feedback Not Refreshed',
                    'Failed to get new feedback from backend. Please try again.'
                );
            },
        });
    }

    feedbackStarIcon(starNumber: number): string {
        const rating =
            this.hoverRatingValue !== null
                ? this.hoverRatingValue
                : this.feedbackRatingValue;
        return rating >= starNumber ? 'star' : 'star_border';
    }

    onStarHover(index: number | null) {
        if (index === null) {
            this.hoverRatingValue = null;
        } else {
            this.hoverRatingValue = index;
        }
    }

    onStarClick(index: number) {
        if (this.hasRated) return;

        const rating = index;

        this.openConfirmDialog(
            'Rate Feedback',
            `Are you sure you want to rate this feedback as ${rating} star${
                rating > 1 ? 's' : ''
            }?`
        ).subscribe(async (decision: boolean) => {
            if (decision) {
                this.hasRated = true;
                this.feedbackRatingValue = rating;
                await this.experienceService.updateExperience(this.transcript, {
                    feedback_rating: rating,
                });
                this.transcript.feedback_rating = rating;
            } else {
                return;
            }
        });
    }

    /*generateImages(): void {
        this.isExpanded = true; // Expand the card to show images
        if (this.imageUrls.length > 0) {
            console.log('Images already generated:', this.imageUrls);
            return;
        }
        this.aiService.generateImages(this.transcript.transcript).subscribe({
            next: (response) => {
                this.imageUrls = response.imageUrls; // Assuming the response contains an array of image URLs
                console.log('Generated images:', this.imageUrls);
            },
            error: (err) => {
                console.error('Error generating images:', err);
                //alert('Failed to generate images.');
                this.openAlertDialog(
                    'Failed: Images Not Generated',
                    'Failed to generate images for this story. Please try again.'
                );
            },
        });
    }*/

    /*storeImage(url: string) {
        this.selectedImage = url;
        this.uploading = true;

        this.aiService.uploadImageToFirebase(url, this.transcript).subscribe({
            next: (res) => {
                console.log('Image uploaded:', res.firebaseUrl);
                this.transcript.imageUrl = res.firebaseUrl;

                // Update the Firestore document with the new imageUrl
                this.experienceService
                    .updateExperience(this.transcript, {
                        imageUrl: res.firebaseUrl,
                    })
                    .then(() => {
                        console.log('Firestore document updated successfully!');
                        //alert('Image saved successfully!');
                        this.openAlertDialog(
                            'Success: Image Saved',
                            'The image you selected was saved successfully!'
                        );
                    })
                    .catch((err) => {
                        console.error(
                            'Failed to update Firestore document',
                            err
                        );
                        //alert('Failed to update Firestore document');
                        this.openAlertDialog(
                            'Failed: Image Not Saved',
                            'Failed to save the image you selected for this story. Please try again.'
                        );
                    });
            },
            error: (err) => {
                console.error('Upload failed', err);
                //alert('Failed to upload image');
                this.openAlertDialog(
                    'Failed: Image Not Updated',
                    'Failed to updated the image for this story. Please try again.'
                );
            },
            complete: () => {
                this.uploading = false;
            },
        });
    }*/

    onOpenImageModal() {
        this.openImageModal.emit(this.transcript.id);
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
