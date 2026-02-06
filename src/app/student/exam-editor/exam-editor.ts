import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket';
import { ExamService } from '../../services/exam';
import loader from '@monaco-editor/loader';

@Component({
  selector: 'app-exam-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './exam-editor.html',
  styleUrls: ['./exam-editor.css']
})
export class ExamEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;

  editor: any;
  private mediaStream: MediaStream | null = null;
  private streamInterval: any;

  // إحصائيات الأمان
  violationCount = 0;
  isExamFinished = false; // متغير حرج لمنع التكرار
  isPanicMode = false;
  showSecurityToast = false;
  isRedAlarm = false;
  securityMessage = '';
  cvActive = false;
  savedCodeKey = 'ofoq_exam_backup';

  // تتبع حركة الرأس
  private activeDirection = 'forward';
  private directionStartTime = 0;
  private alarmTriggeredForCurrent = false;

  timeRemaining = 45 * 60;
  timerDisplay = '45:00';
  private timerInterval: any;
  output = `System Initialized. Status: Secure.`;

  constructor(private router: Router, private socketService: SocketService, private examService: ExamService) {}

  // --- حماية النظام (Warnings) ---
  @HostListener('document:contextmenu', ['$event'])
  preventRightClick(e: MouseEvent) {
    e.preventDefault();
    this.showWarning('Right-Click Blocked! (Warning)');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if ((ctrl && ['c', 'v', 'a', 'x', 's'].includes(key)) || e.key === 'F12') {
      e.preventDefault();
      this.showWarning(`Shortcut Ctrl+${key.toUpperCase()} Blocked! (Warning)`);
    }
  }

  // --- حماية الـ Tabs (Alarm فوري) ---
  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden && !this.isExamFinished) {
      this.isPanicMode = true;
      this.triggerViolentAlarm('ALARM: Tab Switch Detected!');
    } else {
      setTimeout(() => this.isPanicMode = false, 1500);
    }
  }

  // --- منطق الـ AI والـ 5 ثوانٍ ---
  listenToAI() {
    this.socketService.aiReport$.subscribe((res: any) => {
      if (this.isExamFinished) return; // توقف عن الاستماع إذا انتهى الامتحان

      if (res.type === 'result' && res.data) {
        const dir = res.data.direction.toLowerCase();
        if (dir === 'forward' || dir === 'center') {
          this.resetHeadState();
        } else {
          this.processHeadMovement(dir);
        }
      }
    });
  }

  processHeadMovement(dir: string) {
    const now = Date.now();
    if (this.activeDirection !== dir) {
      this.activeDirection = dir;
      this.directionStartTime = now;
      this.alarmTriggeredForCurrent = false;
      this.showWarning(`Warning: Please look at the screen! (${dir})`);
    } else if (!this.alarmTriggeredForCurrent) {
      const elapsed = (now - this.directionStartTime) / 1000;
      if (elapsed >= 5) {
        this.alarmTriggeredForCurrent = true;
        this.triggerViolentAlarm(`ALARM: Excessive Head Movement (${dir})!`);
      }
    }
  }

  resetHeadState() {
    this.activeDirection = 'forward';
    this.directionStartTime = 0;
    this.alarmTriggeredForCurrent = false;
  }

  // --- إدارة التنبيهات وقفل الامتحان ---
  showWarning(msg: string) {
    if (this.isRedAlarm || this.isExamFinished) return;
    this.securityMessage = msg;
    this.isRedAlarm = false;
    this.showSecurityToast = true;
    this.output += `\n[Warning]: ${msg}`;
    setTimeout(() => { if(!this.isRedAlarm) this.showSecurityToast = false; }, 3000);
  }

  triggerViolentAlarm(msg: string) {
    if (this.isExamFinished) return;

    this.violationCount++;
    this.securityMessage = msg;
    this.isRedAlarm = true;
    this.showSecurityToast = true;
    this.output += `\n[ALARM ${this.violationCount}/3]: ${msg}`;

    this.playAlarmSound();

    // القفل الفوري عند الوصول لـ 3 إنذارات
    if (this.violationCount >= 3) {
      this.output += `\n[CRITICAL]: 3 Alarms reached. Terminating session NOW.`;
      // لا ننتظر طويلاً، نغلق الامتحان فوراً لضمان عدم استكمال الغش
      setTimeout(() => this.submitSolution(), 1000);
    } else {
      setTimeout(() => { this.showSecurityToast = false; this.isRedAlarm = false; }, 5000);
    }
  }

  private playAlarmSound() {
    const audio = new Audio('assets/sounds/alert.mp3');
    audio.play().catch(() => {});
  }

  // --- الـ Editor والـ Local Storage ---
  ngAfterViewInit() {
    this.initCamera();
    this.enterFullScreen();

    loader.init().then((monaco: any) => {
      const recovered = localStorage.getItem(this.savedCodeKey);
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: recovered || `# Solve the problem here\ndef solve():\n    pass`,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        contextmenu: false
      });

      this.editor.onDidChangeModelContent(() => {
        if (!this.isExamFinished) {
          localStorage.setItem(this.savedCodeKey, this.editor.getValue());
        }
      });
    });
    this.startTimer();
  }

  // --- التحكم في الامتحان والإنهاء ---
  submitSolution() {
    if (this.isExamFinished) return;
    this.isExamFinished = true; // نمنع أي محاولات تقديم أخرى

    this.output += `\nSystem: Finalizing submission...`;

    // 1. إيقاف كل شيء فوراً
    this.stopEverything();

    // 2. إرسال البيانات للسيرفر
    const studentCode = this.editor ? this.editor.getValue() : localStorage.getItem(this.savedCodeKey);

    this.examService.submitExam({
      code: studentCode,
      violations: this.violationCount,
      terminated: this.violationCount >= 3
    }).subscribe({
      next: () => this.goToResults(),
      error: () => this.goToResults() // ننتقل للنتائج حتى لو فشل السيرفر
    });
  }

  private goToResults() {
    localStorage.removeItem(this.savedCodeKey); // مسح النسخة الاحتياطية
    this.router.navigate(['/results'], { replaceUrl: true }); // الانتقال الفوري لصفحة النتائج
  }

  private stopEverything() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
    this.socketService.disconnect();
    if (this.streamInterval) clearInterval(this.streamInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }

  // --- الكاميرا والـ Streaming ---
  async initCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640 } });
      if (this.videoElement?.nativeElement) this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.socketService.connectToAI();
      this.listenToAI();
      this.startStreaming();
    } catch { this.output += '\nError: Camera access required.'; }
  }

  startStreaming() {
    this.streamInterval = setInterval(() => {
      if (this.isExamFinished) return;
      const video = this.videoElement?.nativeElement;
      if (video && video.readyState === 4) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        this.socketService.sendFrame(canvas.toDataURL('image/jpeg', 0.4));
      }
    }, 250);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        const m = Math.floor(this.timeRemaining / 60);
        const s = this.timeRemaining % 60;
        this.timerDisplay = `${m}:${s.toString().padStart(2, '0')}`;
      } else { this.submitSolution(); }
    }, 1000);
  }

  enterFullScreen() {
    const el = document.documentElement as any;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  }

  ngOnDestroy() { this.stopEverything(); }
}
