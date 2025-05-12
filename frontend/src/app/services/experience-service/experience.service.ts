import { Injectable } from "@angular/core";
import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "@angular/fire/firestore";
import { Experience, NewExperience } from "../../experience";
import { Student } from "../../student";
import { Observable } from "rxjs";
import { getAuth } from "firebase/auth";

@Injectable({
    providedIn: "root",
})
export class ExperienceService {
    constructor(private angularFireStore: Firestore) {}

    // Add a new experience
    addExperience(experience: Experience) {
        experience.id = doc(collection(this.angularFireStore, "id")).id;
        return addDoc(
            collection(this.angularFireStore, "Experiences"),
            experience
        );
    }

    // Get all experiences
    getExperience(): Observable<NewExperience[]> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is currently logged in.");
            return new Observable<NewExperience[]>();
        }
        
        const deviceId = user?.uid;

        let experienceRef = collection(this.angularFireStore, "NewExperiences");
        const experienceQuery = query(experienceRef, where('device_id', '==', deviceId));
        return collectionData(experienceQuery, {
            idField: "id",
        }) as Observable<NewExperience[]>;
    }

    // Delete an experience
    deleteExperience(experience: Experience) {
        let docRef = doc(this.angularFireStore, `Experiences/${experience.id}`);
        return deleteDoc(docRef);
    }

    // Update an experience
    updateExperience(experience: Experience, experiences: any) {
        let docRef = doc(this.angularFireStore, `Experiences/${experience.id}`);
        return updateDoc(docRef, experiences);
    }

    // Parse experience CSV file to get experiences
    parseExperienceCSVContent(experience: Experience) {
        experience.id = doc(collection(this.angularFireStore, "id")).id;
        return addDoc(
            collection(this.angularFireStore, "Experiences"),
            experience
        );
    }

    // Parse student CSV file to get experiences
    parseStudentCSVContent(student: Student) {
        student.id = doc(collection(this.angularFireStore, "id")).id;
        return addDoc(collection(this.angularFireStore, "Students"), student);
    }
}