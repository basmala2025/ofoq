import { Component } from '@angular/core';
import { Navbar } from "../dashboard/navbar/navbar";
import { Homedashboard } from "./homedashboard/homedashboard";

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Homedashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
