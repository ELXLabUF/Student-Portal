import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStoriesComponent } from './student-stories.component';

describe('StudentStoriesComponent', () => {
  let component: StudentStoriesComponent;
  let fixture: ComponentFixture<StudentStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
