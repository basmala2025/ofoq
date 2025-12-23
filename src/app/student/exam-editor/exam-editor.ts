import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import loader from '@monaco-editor/loader';

type Monaco = typeof import('monaco-editor');

@Component({
  selector: 'app-exam-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './exam-editor.html',
  styleUrls: ['./exam-editor.css']
})
export class ExamEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;

  editor: any;
  private monacoNamespace: Monaco | null = null;
  private mediaStream: MediaStream | null = null;

  // --- Exam State ---
  violationCount = 0;
  isPanicMode = false;
  cvActive = true;
  securityMessage = '';
  showSecurityToast = false;

  language = 'python';
  timeRemaining = 42 * 60 + 35;
  timerDisplay = '42:35';
  private timerInterval: any;

  languages = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' }
  ];

  output = `System Initialized. All security protocols are active.`;

  constructor(private router: Router) {}

  // --- 🔒 Security Protocols (Anti-Cheat) ---

  @HostListener('document:contextmenu', ['$event'])
  preventRightClick(e: MouseEvent) { e.preventDefault(); }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    // قفل Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X, Ctrl+S, F12
    const forbiddenKeys = ['c', 'v', 'a', 'x', 's'];
    if ((e.ctrlKey && forbiddenKeys.includes(key)) || e.key === 'F12') {
      e.preventDefault();
      this.recordViolation('Shortcut Blocked: Action not allowed.');
    }
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.isPanicMode = true;
      this.recordViolation('Tab Switch Detected! Screen blurred for security.');
    } else {
      setTimeout(() => this.isPanicMode = false, 2000);
    }
  }

  @HostListener('window:blur')
  onWindowBlur() {
    this.isPanicMode = true;
    this.recordViolation('Focus Lost! Please stay on the exam screen.');
  }

  @HostListener('window:focus')
  onWindowFocus() {
    this.isPanicMode = false;
  }

  recordViolation(msg: string) {
    this.violationCount++;
    this.securityMessage = msg;
    this.showSecurityToast = true;

    setTimeout(() => { this.showSecurityToast = false; }, 4000);

    if (this.violationCount >= 3) {
      this.submitSolution();
    }
  }

  // --- 📸 Camera Management ---

  async initCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.mediaStream;
      }
    } catch (err) {
      this.recordViolation('Camera Error: Camera access is mandatory for this exam.');
    }
  }

  private stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = null;
      }
      console.log('Camera stopped.');
    }
  }

  // --- 💻 Editor & LifeCycle ---

  ngAfterViewInit() {
    this.initCamera();
    loader.init().then((monaco: Monaco) => {
      this.monacoNamespace = monaco;
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.getTemplateCode('python'),
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        contextmenu: false,
        fontSize: 15,
        quickSuggestions: false,
        wordBasedSuggestions: 'off',
        minimap: { enabled: false }
      });
    });
    this.startTimer();
  }

  enterFullScreen() {
    const el = document.documentElement as any;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  }

  // --- 🏁 Exam Actions ---

  submitSolution() {
    this.stopCamera();

    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    this.router.navigate(['/results'], { replaceUrl: true });
  }

  exitExam() {
    if (confirm('Are you sure? Progress will not be saved.')) {
      this.stopCamera();
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.router.navigate(['/dashboardstudent']);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        const m = Math.floor(this.timeRemaining / 60);
        const s = this.timeRemaining % 60;
        this.timerDisplay = `${m}:${s.toString().padStart(2, '0')}`;
      } else {
        clearInterval(this.timerInterval);
        this.submitSolution();
      }
    }, 1000);
  }

  runCode() {
    this.output = `Running tests...\nAll test cases passed ✓\nExecution time: 0.23ms`;
  }

  getTemplateCode(lang: string): string {
    const templates: any = {
      python: `class Solution:\n    def maxDepth(self, root):\n        # Your code here`,
      cpp: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}`
    };
    return templates[lang] || '';
  }

  onLanguageChange() {
    if (this.editor && this.monacoNamespace) {
      const model = this.editor.getModel();
      this.monacoNamespace.editor.setModelLanguage(model, this.language);
      this.editor.setValue(this.getTemplateCode(this.language));
    }
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.editor) this.editor.dispose();
  }
}
