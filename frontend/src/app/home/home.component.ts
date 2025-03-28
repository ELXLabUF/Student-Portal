import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <main class="main-container">
      <h1>Main Menu</h1>
      <div class="menu-buttons">
        <button>My Stories</button>
        <button>Class Stories</button>
      </div>
    </main>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {}
