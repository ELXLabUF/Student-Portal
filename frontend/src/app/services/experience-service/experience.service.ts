import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { NewExperience } from '../../experience';
import { Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExperienceService {
    private user$: Observable<any>;

    constructor(private angularFireStore: Firestore, private auth: Auth) {
        // Subscribe to the authState Observable to track the logged-in user
        this.user$ = authState(this.auth).pipe(
            filter((user) => !!user) // Ensure the user is not null
        );
    }

    // Get User's Experiences
    getExperiences(): Observable<NewExperience[]> {
        return this.user$.pipe(
            switchMap((user) => {
                const deviceId = user.uid;
                let experienceRef = collection(
                    this.angularFireStore,
                    'NewExperiences'
                );
                const experienceQuery = query(
                    experienceRef,
                    where('device_id', '==', deviceId)
                );
                return collectionData(experienceQuery, {
                    idField: 'id',
                }) as Observable<NewExperience[]>;
            })
        );
    }

    // Get All Experiences
    getAllExperiences(): Observable<NewExperience[]> {
        let experienceRef = collection(this.angularFireStore, 'NewExperiences');
        return collectionData(experienceRef, { idField: 'id' }) as Observable<
            NewExperience[]
        >;
    }

    // Update an experience
    //updateExperience(experience: NewExperience, updates: any) {
    //    let docRef = doc(
    //        this.angularFireStore,
    //        `NewExperiences/${experience.id}`
    //    );
    //    return updateDoc(docRef, updates);
    //}
    updateExperience(
        experience: NewExperience,
        updates: Partial<NewExperience>
    ) {
        const docRef = doc(
            this.angularFireStore,
            `NewExperiences/${experience.id}`
        );
        return updateDoc(docRef, updates);
    }

    // Add a new experience
    addExperience(experience: NewExperience) {
        const docRef = doc(
            this.angularFireStore,
            `NewExperiences/${experience.id}`
        );
        return setDoc(docRef, experience);
    }
}
