import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardComponent } from '../../components/flashcard/flashcard.component';
import { AuthService } from '../../services/auth-service/auth.service';
import { ExperienceService } from '../../services/experience-service/experience.service';
import { Experience, NewExperience } from '../../experience';

@Component({
  selector: 'app-class-stories',
  imports: [CommonModule, FlashcardComponent],
  template: `
    <div class="main-container">
      <div class="grid-container">
        <h1>Class Stories</h1>
        <div class="flashcard-grid">
          <ng-container>
            <app-flashcard
              *ngFor="let experience of experiences"
              [frontImage]="experience.imageUrl"
              [backText]="experience.transcript"
            ></app-flashcard>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrl: './class-stories.component.css',
})
export class ClassStoriesComponent {
  experiences: NewExperience[] = [];

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experienceService.getAllExperiences().subscribe((data: NewExperience[]) => {
      // Filter out experiences with an empty imageUrl
      this.experiences = data.filter(experience => experience.imageUrl && experience.imageUrl.trim() !== '');
    });
  }
}
