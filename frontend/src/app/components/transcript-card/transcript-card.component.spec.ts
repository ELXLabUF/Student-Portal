import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptCardComponent } from './transcript-card.component';

describe('TranscriptListItemComponent', () => {
  let component: TranscriptCardComponent;
  let fixture: ComponentFixture<TranscriptCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
