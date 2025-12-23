import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isMenuOpen = false;

 toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;

  if (this.isMenuOpen) {
    document.body.classList.add('menu-open-body');
  } else {
    document.body.classList.remove('menu-open-body');
  }
}

closeMenu() {
  this.isMenuOpen = false;
  document.body.classList.remove('menu-open-body');
}
}
