import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main class="main-container">
      <h1>Main Menu</h1>
      <div class="menu-buttons">
        <button><a routerLink="/stories">My Stories</a></button>
        <button><a routerLink="/class">Class Stories</a></button>
      </div>
    </main>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {}
