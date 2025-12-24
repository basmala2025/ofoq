import { Component } from '@angular/core';
import { Navbar } from "../dashboard/navbar/navbar";
import { homedashboard } from "./homedashboard/homedashboard";

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, homedashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
