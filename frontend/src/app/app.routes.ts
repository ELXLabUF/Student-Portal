import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { ClassStoriesComponent } from './pages/class-stories/class-stories.component';
import { StudentTranscriptsComponent } from './pages/student-transcripts/student-transcripts.component';

export const routes: Routes = [
  { path: '', redirectTo:'/login', pathMatch:"full" }, // Default route
  { path: 'home', component: StudentTranscriptsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'class', component: ClassStoriesComponent },
  { path: 'about', component: AboutComponent},
  { path: 'account', component: AccountComponent},
  { path: '**', redirectTo:'/login'}
];
