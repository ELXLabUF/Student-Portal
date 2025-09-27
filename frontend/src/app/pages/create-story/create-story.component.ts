import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { Timestamp } from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { NewExperience } from '../../experience';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-create-story',
    imports: [FormsModule, CommonModule],
    templateUrl: './create-story.component.html',
    styleUrl: './create-story.component.css',
})
export class CreateStoryComponent implements OnInit, OnDestroy {
    private auth = getAuth();
    user = this.auth.currentUser;
    authSub: Subscription | undefined;

    isRecording = false;
    mediaRecorder!: MediaRecorder;
    recordedChunks: BlobPart[] = [];

    activeCapture = 'Default';
    selectedTopic: string = '';
    capturePrompt: string = '';
    story: string = '';

    private storyInputTimeout: any = null;
    private readonly debounceTime: number = 1500;

    constructor(
        private router: Router,
        private firestore: Firestore,
        private storage: Storage,
        private experienceService: ExperienceService,
        private authService: AuthService,
        private userInteractionService: UserInteractionService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.userInteractionService.startPageTimer("'Record A Story' page");

        this.authSub = this.authService.currentUser.subscribe((user) => {
            if (user) {
                this.user = user;
                this.loadActiveCapture();
            }
        });
    }

    ngOnDestroy() {
        this.userInteractionService.endPageTimerAndLog("'Record A Story' page");

        if (this.authSub) {
            this.authSub.unsubscribe();
        }
    }

    async loadActiveCapture() {
        if (!this.user) {
            return;
        }
        try {
            const studentsRef = collection(this.firestore, 'NewStudents');
            const q = query(
                studentsRef,
                where('device_id', '==', this.user.uid)
            );
            const querySnap = await getDocs(q);

            if (querySnap.empty) {
                console.warn('No NewStudents document found for user');
                return;
            }

            const studentSnap = querySnap.docs[0];
            const studentData = studentSnap.data();

            const classroomName = studentData['classroom'];

            if (!classroomName) {
                console.warn('Classroom field missing');
                return;
            }

            // Get active capture from Classroom collection document (classroomName)
            const classroomDocRef = doc(
                this.firestore,
                'Classroom',
                classroomName
            );
            const classroomSnap = await getDoc(classroomDocRef);

            if (!classroomSnap.exists()) {
                console.warn('Classroom document not found:', classroomName);
                return;
            }

            const capture = classroomSnap.data()?.['capture'];

            if (capture) {
                this.activeCapture = capture;
            }

            const data = classroomSnap.data();
            // Save values to class, defaulting to '' if missing.
            this.selectedTopic = data?.['selected_topic'] ?? '';
            this.capturePrompt = data?.['capture_prompt'] ?? '';

            //if (this.selectedTopic) {
            //    this.activeCapture = this.selectedTopic;
            //}
        } catch (error) {
            console.error('Error loading active capture:', error);
        }
    }

    async toggleRecording() {
        if (!this.selectedTopic && !this.capturePrompt) {
            this.openAlertDialog(
                'No Project',
                'There is no project currently. Please see your teacher for instructions!'
            );
            return;
        }

        if (this.isRecording) {
            this.userInteractionService.logUserInteraction(
                'Clicked',
                "'Stop Recording' button",
                'Stop audio recording and save story'
            );
            this.stopRecording();
        } else {
            this.userInteractionService.logUserInteraction(
                'Clicked',
                "'Start Recording' button",
                'Begin audio recording'
            );
            await this.startRecording();
        }
    }

    async startRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.openAlertDialog(
                'Error',
                'Audio recording is not supported in this browser.'
            );
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            this.mediaRecorder.start();
            this.isRecording = true;
        } catch (err) {
            console.error('Error starting recording:', err);
            this.openAlertDialog('Error', 'Failed to start audio recording.');
        }
    }

    async stopRecording() {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.recordedChunks, {
                type: 'audio/mp3',
            });
            if (!this.user) {
                this.openAlertDialog('Error', 'User not authenticated.');
                this.isRecording = false;
                return;
            }

            const deviceId = this.user.uid;

            try {
                // Upload audio file first
                const time = new Date();
                const pad = (n: number) => n.toString().padStart(2, '0');
                const formattedDate =
                    [
                        time.getFullYear(),
                        pad(time.getMonth() + 1),
                        pad(time.getDate()),
                    ].join('-') +
                    'T' +
                    [
                        pad(time.getHours()),
                        pad(time.getMinutes()),
                        pad(time.getSeconds()),
                    ].join('-');

                const cleanCapture = this.activeCapture.replace(
                    /[^a-zA-Z0-9\-]/g,
                    '-'
                );
                const fileName = `${cleanCapture}_${formattedDate}.mp3`;
                const filePath = `voice_recordings/${deviceId}/${fileName}`;

                const storageRef = ref(this.storage, filePath);
                await uploadBytes(storageRef, audioBlob);

                const transcriptText = '';

                // Create the NewExperience object with all required fields
                const newExperience: NewExperience = {
                    id: `${deviceId}_${formattedDate}`,
                    capture: this.activeCapture,
                    topic: this.selectedTopic,
                    creation_date: Timestamp.fromDate(time),
                    device_id: deviceId,
                    recording_path: filePath,
                    show_to_teacher: false,
                    transcript: transcriptText,
                    translation: transcriptText,
                    original_transcript: transcriptText,
                    imageUrl: '',
                    uploadedImageUrl: '',
                    edited: false,
                    ai_feedback: '',
                    feedback_rating: 0,
                    previous_feedback: [],
                };

                await this.experienceService.addExperience(newExperience);

                this.openAlertDialog(
                    'Success',
                    'Audio recording uploaded and story saved successfully.'
                );
            } catch (error) {
                console.error('Error saving audio and transcript:', error);
                this.openAlertDialog(
                    'Failed',
                    'Failed to upload audio and save story. Please try again.'
                );
            }
            this.isRecording = false;
        };
        this.mediaRecorder.stop();
        this.isRecording = false;
    }

    async uploadAudio(audioBlob: Blob) {
        if (!this.user) {
            this.openAlertDialog('Error', 'User not authenticated.');
            return;
        }

        try {
            const time = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedDate =
                [
                    time.getFullYear(),
                    pad(time.getMonth() + 1),
                    pad(time.getDate()),
                ].join('-') +
                'T' +
                [
                    pad(time.getHours()),
                    pad(time.getMinutes()),
                    pad(time.getSeconds()),
                ].join('-');

            // File name as: {activeCapture}_2025-04-14T13-11-58.mp3
            const cleanCapture = this.activeCapture.replace(
                /[^a-zA-Z0-9\-]/g,
                '-'
            );
            const fileName = `${cleanCapture}_${formattedDate}.mp3`;
            const filePath = `voice_recordings/${this.user.uid}/${fileName}`;

            const storageRef = ref(this.storage, filePath);
            await uploadBytes(storageRef, audioBlob);

            this.openAlertDialog(
                'Success: Recording Uploaded',
                `Your audio recording was uploaded successfully as ${fileName}.`
            );
        } catch (error) {
            console.error('Upload failed:', error);
            this.openAlertDialog(
                'Failed: Upload Failed',
                'Failed to upload the audio. Please try again.'
            );
        }
    }

    onStoryInput(): void {
        // Clear the previous timeout to reset the timer
        clearTimeout(this.storyInputTimeout);

        // Set a new timeout to log the interaction after a pause
        this.storyInputTimeout = setTimeout(() => {
            this.logStoryChange();
        }, this.debounceTime);
    }

    private logStoryChange(): void {
        this.userInteractionService.logUserInteraction(
            'Typed',
            "'Story' textarea",
            `Text changed (length: ${this.story.length} characters)`
        );
    }

    confirmSubmitStory() {
        if (!this.selectedTopic && !this.capturePrompt) {
            this.openAlertDialog(
                'No Project',
                'There is no project currently. Please see your teacher for instructions!'
            );
            return;
        }

        if (!this.story.trim()) {
            this.openAlertDialog(
                'Warning',
                'Please enter a story before submitting.'
            );
            return;
        }

        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Submit' story button",
            'Open confirmation dialog'
        );

        this.openConfirmDialog(
            'Submit Story',
            'Are you sure you want to submit your story?'
        ).subscribe(async (decision: boolean) => {
            if (decision) {
                this.userInteractionService.logUserInteraction(
                    'Clicked',
                    "'Confirm' on submit story dialog",
                    'User confirmed story submission'
                );
                this.submitStory();
            } else {
                this.userInteractionService.logUserInteraction(
                    'Clicked',
                    "'Cancel' on submit story dialog",
                    'User cancelled story submission'
                );
                return;
            }
        });
    }

    async submitStory() {
        if (!this.user) {
            this.openAlertDialog('Error', 'User not authenticated.');
            return;
        }

        try {
            const deviceId = this.user.uid;
            const time = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedDate =
                [
                    time.getFullYear(),
                    pad(time.getMonth() + 1),
                    pad(time.getDate()),
                ].join('-') +
                'T' +
                [
                    pad(time.getHours()),
                    pad(time.getMinutes()),
                    pad(time.getSeconds()),
                ].join('-');

            const newExperience: NewExperience = {
                id: `${deviceId}_${formattedDate}`,
                capture: this.activeCapture,
                topic: this.selectedTopic,
                creation_date: Timestamp.fromDate(time),
                device_id: deviceId,
                recording_path: '',
                show_to_teacher: false,
                transcript: this.story,
                translation: this.story,
                original_transcript: this.story,
                imageUrl: '',
                uploadedImageUrl: '',
                edited: false,
                ai_feedback: '',
                feedback_rating: 0,
                previous_feedback: [],
            };

            await this.experienceService.addExperience(newExperience);

            this.openAlertDialog(
                'Success: Story Submitted',
                'Your story was submitted successfully!'
            );
            this.story = '';
        } catch (error) {
            console.error('Submission error:', error);
            this.openAlertDialog(
                'Failed: Submission Failed',
                'An error occurred while submitting your story. Please try again.'
            );
        }
    }

    onBackClick() {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Back' button",
            "Navigate to 'Main Menu' page"
        );
        this.router.navigate(['/home']);
    }

    openAlertDialog(title: string, message: string) {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title, message },
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
