import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  template: `
    <header>
      <h3 class="logo">Contextualizer</h3>
      <nav >
        <ul class="nav-links">
          <li><a routerLink="">Home</a></li>
          <li><a routerLink="/about">About</a></li>
          <li><a routerLink="/account">Account</a></li>
        </ul>
      </nav>
    </header>
  `,
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {}
