import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackUtilizationModalComponent } from './feedback-utilization-modal.component';

describe('FeedbackUtilizationModalComponent', () => {
    let component: FeedbackUtilizationModalComponent;
    let fixture: ComponentFixture<FeedbackUtilizationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeedbackUtilizationModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackUtilizationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
