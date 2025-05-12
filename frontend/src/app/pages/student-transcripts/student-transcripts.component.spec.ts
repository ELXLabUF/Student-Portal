import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTranscriptsComponent } from './student-transcripts.component';

describe('StudentTranscriptsComponent', () => {
  let component: StudentTranscriptsComponent;
  let fixture: ComponentFixture<StudentTranscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTranscriptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
