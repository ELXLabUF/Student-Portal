import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(private router: Router) {}

    onCreateStoryClick() {
        this.router.navigate(['/create-story']);
    }

    onMyStoriesClick() {
        this.router.navigate(['/stories']);
    }

    //onClassStoriesClick() {
    //    this.router.navigate(['/class']);
    //}

    //onUploadImagesClick() {
    //    this.router.navigate(['/upload']);
    //}
}
