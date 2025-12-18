import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Home } from "./home/home";
import { Signup } from './auth/signup/signup';
import { Dashboard } from "./dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home, Signup, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-demo');
}
