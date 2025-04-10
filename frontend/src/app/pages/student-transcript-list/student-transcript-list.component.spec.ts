import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTranscriptListComponent } from './student-transcript-list.component';

describe('StudentTranscriptListComponent', () => {
  let component: StudentTranscriptListComponent;
  let fixture: ComponentFixture<StudentTranscriptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTranscriptListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTranscriptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
