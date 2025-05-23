import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  template: `
    <header>
      <h3 class="logo"><a routerLink="/home">StoryLoop</a></h3>
      <nav>
        <ul class="nav-links">
          <li><a routerLink="/class">Class</a></li>
          <li><a routerLink="/about">About</a></li>
          <li><a routerLink="/account">Account</a></li>
        </ul>
      </nav>
    </header>
  `,
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {}
