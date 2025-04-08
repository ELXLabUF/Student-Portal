import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main class="main-container">
      <h1 class="title">Main Menu</h1>
      <div class="menu-buttons">
        <button routerLink="/stories">My Stories</button>
        <button routerLink="/class">Class Stories</button>
      </div>
    </main>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {}
