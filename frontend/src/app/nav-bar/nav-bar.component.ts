import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  template: `
    <header>
      <h3 class="logo">Contextualizer</h3>
      <nav>
        <ul class="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Account</a></li>
        </ul>
      </nav>
    </header>
  `,
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {}
