import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    Firestore,
    collection,
    getDocs,
    query,
    where,
} from '@angular/fire/firestore';
import { FlashcardComponent } from '../../components/flashcard/flashcard.component';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { NewExperience } from '../../experience';
import { NewStudent } from '../../student';

@Component({
    selector: 'app-class-stories',
    imports: [CommonModule, FlashcardComponent],
    templateUrl: './class-stories.component.html',
    styleUrl: './class-stories.component.css',
})
export class ClassStoriesComponent implements OnInit {
    private auth = getAuth();
    user = this.auth.currentUser;
    classroomName: string = '';
    students: NewStudent[] = [];
    allDeviceIDs: string[] = [];
    experiences: NewExperience[] = [];

    constructor(
        private experienceService: ExperienceService,
        private angularFirestore: Firestore
    ) {}

    async ngOnInit(): Promise<void> {
        this.user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user: any) => {
                unsubscribe(); // Unsubscribe immediately after getting the user
                resolve(user);
            });
        });

        if (this.user) {
            await this.getClassroomName(this.user.uid);
        }

        await this.getAllStudents();

        this.experienceService
            .getAllExperiences()
            .subscribe((data: NewExperience[]) => {
                // Only include experiences with an image selected (non empty imageUrl),
                // show_to_teacher value as true and from students belonging to this classroom
                this.experiences = data.filter(
                    (experience) =>
                        experience.imageUrl &&
                        experience.imageUrl.trim() !== '' &&
                        experience.show_to_teacher === true &&
                        this.allDeviceIDs.includes(experience.device_id)
                );
            });
    }

    async getClassroomName(deviceId: string): Promise<void> {
        try {
            const studentsRef = collection(
                this.angularFirestore,
                'NewStudents'
            );
            const q = query(studentsRef, where('device_id', '==', deviceId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const studentDoc = querySnapshot.docs[0];
                this.classroomName = studentDoc.data()['classroom'] || '';
            } else {
                console.warn('No student found with the given device_id.');
            }
        } catch (error) {
            console.error('Error fetching classroom name:', error);
        }
    }

    async getAllStudents() {
        try {
            const classroomRef = collection(this.angularFirestore, 'Classroom');
            const q = query(
                classroomRef,
                where('id', '==', this.classroomName)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const classroomDoc = querySnapshot.docs[0];
                this.students = classroomDoc.data()['students'] || {};
                this.allDeviceIDs = Object.keys(this.students);
            } else {
                console.warn('No classroom found with the given name.');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }
}
