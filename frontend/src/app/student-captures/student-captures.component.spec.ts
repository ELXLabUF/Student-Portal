import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCapturesComponent } from './student-captures.component';

describe('StudentStoriesComponent', () => {
  let component: StudentCapturesComponent;
  let fixture: ComponentFixture<StudentCapturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCapturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCapturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
