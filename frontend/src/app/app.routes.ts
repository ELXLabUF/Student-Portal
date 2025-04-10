import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { StudentCapturesComponent } from './student-captures/student-captures.component';
import { ClassStoriesComponent } from './class-stories/class-stories.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'stories', component: StudentCapturesComponent }, // Assuming 'stories' is handled by HomeComponent for now
  { path: 'class', component: ClassStoriesComponent }, // Assuming 'class' is also handled by HomeComponent
  { path: 'about', component: AboutComponent},
  { path: 'account', component: AccountComponent},
];
