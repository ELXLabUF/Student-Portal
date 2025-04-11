import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptListItemComponent } from './transcript-list-item.component';

describe('TranscriptListItemComponent', () => {
  let component: TranscriptListItemComponent;
  let fixture: ComponentFixture<TranscriptListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
