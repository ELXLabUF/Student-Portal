import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { StudentCapturesComponent } from './pages/student-captures/student-captures.component';
import { ClassStoriesComponent } from './pages/class-stories/class-stories.component';
import { StudentTranscriptListComponent } from './pages/student-transcript-list/student-transcript-list.component';

export const routes: Routes = [
  { path: '', redirectTo:'/login', pathMatch:"full" }, // Default route
  { path: 'home', component: StudentTranscriptListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'stories', component: StudentCapturesComponent },
  { path: 'class', component: ClassStoriesComponent },
  { path: 'about', component: AboutComponent},
  { path: 'account', component: AccountComponent},
  { path: 'transcripts/:captureId', component: StudentTranscriptListComponent},
  { path: '**', redirectTo: '/login' }
];
