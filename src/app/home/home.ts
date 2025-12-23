import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  executionTime = '0.023';

  chartBars = [
    { height: 40 },
    { height: 55 },
    { height: 65 },
    { height: 50 },
    { height: 70 },
    { height: 45 },
    { height: 60 }
  ];

  codeLines = [
    '<span class="code-keyword">def</span> <span class="code-function">calculate_grade</span>(score):',
    '    <span class="code-comment"># Calculate student grade</span>',
    '    <span class="code-keyword">if</span> score >= 90:',
    '        <span class="code-keyword">return</span> <span class="code-string">"A+"</span>',
    '    <span class="code-keyword">elif</span> score >= 80:',
    '        <span class="code-keyword">return</span> <span class="code-string">"A"</span>',
    '    <span class="code-keyword">else</span>:',
    '        <span class="code-keyword">return</span> <span class="code-string">"B+"</span>'
  ];

  onLogin(): void {
    console.log('Login clicked');
    // Implement login logic
  }

  onInstructorAccess(): void {
    console.log('Instructor Access clicked');
    // Navigate to instructor dashboard
  }

  onTryDemo(): void {
    console.log('Try Demo clicked');
    // Navigate to demo exam
  }
}
