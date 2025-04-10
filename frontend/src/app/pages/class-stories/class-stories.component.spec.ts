import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStoriesComponent } from './class-stories.component';

describe('ClassStoriesComponent', () => {
  let component: ClassStoriesComponent;
  let fixture: ComponentFixture<ClassStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
