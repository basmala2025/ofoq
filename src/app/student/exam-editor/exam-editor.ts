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

  // --- حالة الامتحان ---
  violationCount = 0;
  isPanicMode = false;
  isOffline = false;
  savedCodeKey = 'ofoq_exam_backup';
  isExamFinished = false;
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

  // --- بروتوكولات الأمان ---
  @HostListener('document:contextmenu', ['$event'])
  preventRightClick(e: MouseEvent) { e.preventDefault(); }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
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
      this.recordViolation('Tab Switch Detected!');
    } else {
      setTimeout(() => this.isPanicMode = false, 2000);
    }
  }

  @HostListener('window:offline')
  onOffline() {
    this.isOffline = true;
    this.output += `\n[NETWORK]: Connection lost! Switched to Local Save.`;
  }

  @HostListener('window:online')
  onOnline() {
    this.isOffline = false;
    this.output += `\n[NETWORK]: Connection restored.`;
  }

  recordViolation(msg: string) {
    this.violationCount++;
    this.securityMessage = msg;
    this.showSecurityToast = true;
    this.output += `\n[ALERT]: ${msg}`;

    setTimeout(() => { this.showSecurityToast = false; }, 4000);

    if (this.violationCount >= 3) {
      this.submitSolution();
    }
  }

  // --- الكاميرا والمحرر ---
  async initCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.mediaStream;
      }
    } catch (err) {
      this.recordViolation('Camera Error: Access mandatory.');
    }
  }

  private stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  ngAfterViewInit() {
    this.initCamera();
    this.enterFullScreen();

    loader.init().then((monaco: Monaco) => {
      this.monacoNamespace = monaco;
      const recoveredCode = localStorage.getItem(this.savedCodeKey);

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: recoveredCode || this.getTemplateCode('python'),
        language: this.language,
        theme: 'vs-dark',
        automaticLayout: true,
        contextmenu: false,
        fontSize: 15,
        minimap: { enabled: false }
      });

      this.editor.onDidChangeModelContent(() => {
        localStorage.setItem(this.savedCodeKey, this.editor.getValue());
      });
    });

    this.startTimer();
  }

  enterFullScreen() {
    const el = document.documentElement as any;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  }

  // --- تسليم الامتحان وربط البيانات ---
  submitSolution() {
    this.isExamFinished = true;
    this.stopCamera();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentCourseId = 1;

    // إعداد الكائن ليتوافق مع ما تتوقعه صفحة النتائج
    const resultRecord = {
      id: Date.now(),
      studentName: currentUser.fullName || 'Unknown Student',
      courseId: currentCourseId,
      examTitle: 'Binary Trees Quiz',
      category: 'Data Structures', // مطلوب في صفحة النتائج
      score: this.violationCount >= 3 ? 0 : 85,
      violations: this.violationCount,
      date: new Date().toLocaleString(),
      status: this.violationCount >= 3 ? 'Terminated' : 'Passed',
      timeTaken: this.timerDisplay,
      totalLines: this.editor ? this.editor.getModel().getLineCount() : 0, // مطلوب في صفحة النتائج
      testCases: [ // محاكاة حالات الاختبار المطلوبة في صفحة النتائج
        { name: 'Basic tree', status: 'Passed', passed: true },
        { name: 'Single node', status: 'Passed', passed: true },
        { name: 'Unbalanced tree', status: this.violationCount > 0 ? 'Failed' : 'Passed', passed: this.violationCount === 0 },
        { name: 'Security Check', status: this.violationCount < 3 ? 'Passed' : 'Failed', passed: this.violationCount < 3 }
      ]
    };

    // حفظ النتائج للدكتور
    const allResults = JSON.parse(localStorage.getItem('all_students_results') || '[]');
    allResults.push(resultRecord);
    localStorage.setItem('all_students_results', JSON.stringify(allResults));

    // حفظ النتيجة الحالية للطالب (ليقرأها مكون Results)
    localStorage.setItem('ofoq_last_result', JSON.stringify(resultRecord));

    // تنظيف النسخة الاحتياطية
    localStorage.removeItem(this.savedCodeKey);

    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    this.router.navigate(['/results'], { replaceUrl: true });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        const m = Math.floor(this.timeRemaining / 60);
        const s = this.timeRemaining % 60;
        this.timerDisplay = `${m}:${s.toString().padStart(2, '0')}`;
      } else {
        this.submitSolution();
      }
    }, 1000);
  }

  runCode() {
    this.output += `\nRunning tests...\nAll test cases passed ✓`;
  }

  onLanguageChange() {
    if (this.editor && this.monacoNamespace) {
      const model = this.editor.getModel();
      this.monacoNamespace.editor.setModelLanguage(model, this.language);
      this.editor.setValue(this.getTemplateCode(this.language));
    }
  }

  getTemplateCode(lang: string): string {
    const templates: any = {
      python: `class Solution:\n    def maxDepth(self, root):\n        # Your code here`,
      cpp: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}`
    };
    return templates[lang] || '';
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.editor) this.editor.dispose();
  }
}
