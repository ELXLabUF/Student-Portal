import { Component, OnInit } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
    selector: 'app-upload-images',
    imports: [],
    templateUrl: './upload-images.component.html',
    styleUrl: './upload-images.component.css',
})
export class UploadImagesComponent implements OnInit {
    private auth = getAuth();
    user = this.auth.currentUser;

    selectedFile: File | null = null;
    uploadStatus: string = '';
    uploadProgress: number = 0;
    uploadInProgress: boolean = false;
    labelText: string = 'No file selected';

    constructor(private storage: Storage, public dialog: MatDialog) {}

    async ngOnInit(): Promise<void> {
        this.user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user: any) => {
                unsubscribe(); // Unsubscribe immediately after getting the user
                resolve(user);
            });
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
        this.labelText = this.selectedFile
            ? this.selectedFile.name
            : 'No file selected';

        if (!this.selectedFile || !this.selectedFile.name) {
            this.openAlertDialog(
                'Warning: No file selected',
                'No file selected or file name is not valid.'
            );
            return;
        }

        const fileExtension = this.selectedFile.name
            .split('.')
            .pop()
            ?.toLowerCase();

        if (
            fileExtension !== 'jpg' &&
            fileExtension !== 'jpeg' &&
            fileExtension !== 'png'
        ) {
            this.openAlertDialog(
                'Warning: Unsupported File Format',
                'The selected file format is not supported. Please upload an image file in JPG, JPEG or PNG format.'
            );
            this.resetUploadState();
            return;
        }
    }

    resetUploadState() {
        this.selectedFile = null;
        this.labelText = 'No file selected';
        this.uploadStatus = '';
        this.uploadStatus = '';
        this.uploadProgress = 0;
    }

    onUpload() {
        if (!this.selectedFile) {
            this.openAlertDialog(
                'Warning: Incomplete Data',
                'Please select an image file to upload.'
            );
            this.resetUploadState();
            return;
        }

        // Generate timestamp in format YYYYMMDDHHmmss
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

        // Split filename and extension
        const originalName = this.selectedFile.name;
        const lastDotIndex = originalName.lastIndexOf('.');
        let newName: string;

        if (lastDotIndex > 0) {
            const baseName = originalName.substring(0, lastDotIndex);
            const extension = originalName.substring(lastDotIndex);
            newName = `${baseName}_${timestamp}${extension}`;
        } else {
            newName = `${originalName}_${timestamp}`;
        }

        const username = this.user?.uid;
        const filePath = `${username}/${newName}`;
        const fileRef = ref(this.storage, `uploaded-images/${filePath}`);
        const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

        uploadTask.on(
            'state_changed',
            (snapshot: any) => {
                console.log(snapshot);
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.uploadProgress = progress;

                if (snapshot.state === 'running' && progress < 100) {
                    this.uploadStatus = 'Uploading...';
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                this.openAlertDialog(
                    'Failed: File Not Uploaded',
                    'Failed to upload the file. Please try again.'
                );
                console.error('Error uploading file:', error);
                this.uploadStatus = 'Error during upload';
                this.uploadInProgress = false;
            },
            () => {
                // On success
                this.openAlertDialog(
                    'Success: File Uploaded',
                    'The file was uploaded successfully!'
                );
                this.uploadStatus = 'Uploaded';
                this.uploadInProgress = false;
                this.resetUploadState();
            }
        );
    }

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });
    }
}
