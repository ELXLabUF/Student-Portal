import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private userInteractionService: UserInteractionService
    ) {}

    ngOnInit(): void {
        this.userInteractionService.startPageTimer("'Main Menu' page");
    }

    ngOnDestroy(): void {
        this.userInteractionService.endPageTimerAndLog("'Main Menu' page");
    }

    onCreateStoryClick() {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Record A Story' button",
            "Navigate to 'Record A Story' page"
        );
        this.router.navigate(['/create-story']);
    }

    onMyStoriesClick() {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'My Stories' button",
            "Navigate to 'My Stories' page"
        );
        this.router.navigate(['/stories']);
    }

    //onClassStoriesClick() {
    //    this.router.navigate(['/class']);
    //}

    //onUploadImagesClick() {
    //    this.router.navigate(['/upload']);
    //}
}
