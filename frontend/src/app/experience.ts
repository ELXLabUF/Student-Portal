//import { Student } from './student';
import { Timestamp } from 'firebase/firestore';

//export interface Experience {
//    id: string;
//    experience_title: string;
//    experience_description: string;
//    student_name: string;
//    date: string;
//    student_data: Student;
//}

export interface NewExperience {
    id: string;
    capture: string;
    creation_date: Timestamp;
    device_id: string;
    recording_path: string;
    show_to_teacher: boolean;
    transcript: string;
    translation: string;
    imageUrl: string;
    uploadedImageUrl: string;
    edited: boolean;
    original_transcript?: string;
    ai_feedback?: string | null;
    feedback_rating?: number | null;
    previous_feedback?: Array<{ ai_feedback: string; feedback_rating: number }>;
}
