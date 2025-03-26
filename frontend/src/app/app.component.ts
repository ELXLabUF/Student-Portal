import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, NavBarComponent],
  template: `
    <main>
      <app-nav-bar></app-nav-bar>
      <!-- <header> -->
        <!-- <h1 class="app-logo">Contextualizer</h1> -->
      <!-- </header> -->
      <section>
        <app-home></app-home>
      </section>
    </main>
    `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
