import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { ClassStoriesComponent } from './pages/class-stories/class-stories.component';
import { StudentTranscriptsComponent } from './pages/student-transcripts/student-transcripts.component';
import { UploadImagesComponent } from './pages/upload-images/upload-images.component';
import { CreateStoryComponent } from './pages/create-story/create-story.component';
import { authGuard } from '../app/guards/auth-guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },
    {
        path: 'class',
        component: ClassStoriesComponent,
        canActivate: [authGuard],
    },
    {
        path: 'stories',
        component: StudentTranscriptsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'upload',
        component: UploadImagesComponent,
        canActivate: [authGuard],
    },
    {
        path: 'create-story',
        component: CreateStoryComponent,
        canActivate: [authGuard],
    },
    { path: '**', redirectTo: '/login' },
];
