import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';

@Component({
    selector: 'app-about',
    imports: [],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
    constructor(private userInteractionService: UserInteractionService) {}

    ngOnInit(): void {
        this.userInteractionService.startPageTimer("'About' page");
    }

    ngOnDestroy(): void {
        this.userInteractionService.endPageTimerAndLog("'About' page");
    }
}
