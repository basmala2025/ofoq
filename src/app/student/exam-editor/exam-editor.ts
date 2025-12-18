// exam-editor.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import loader from '@monaco-editor/loader';
// 1. Define the necessary type for the Monaco namespace
// (This requires 'monaco-editor' to be installed)
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

  // 2. Declare class properties for the editor instance and the namespace
  // We use 'any' for the editor instance for simplicity, but 'editor.IStandaloneCodeEditor'
  // is the correct type if imported from 'monaco-editor'
  editor: any;
  private monacoNamespace: Monaco | null = null; // Property to store the monaco object (Fix TS2304)

  language = 'python';
  timeRemaining = 42 * 60 + 35;
  timerDisplay = '42:35';
  private timerInterval: any;

  languages = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' }
  ];

  output = `Test Case 1: Passed ✓
Test Case 2: Passed ✓
Test Case 3: Failed ✗ - Expected 4, got 3`;

  ngAfterViewInit() {
    // 3. Use the defined type 'Monaco' for the parameter (Fix TS7006)
    loader.init().then((monaco: Monaco) => {
      this.monacoNamespace = monaco; // Store the object (Required for step 4)

      // Theme definition and editor creation (using the local 'monaco' object)
      monaco.editor.defineTheme('customDark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'C586C0' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'comment', foreground: '6A9955' },
        ],
        colors: {
          'editor.background': '#1E1E2F',
          'editorLineNumber.foreground': '#858585',
        }
      });

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.getTemplateCode('python'),
        language: 'python',
        theme: 'customDark',
        automaticLayout: true,
        fontSize: 15,
        minimap: { enabled: true },
      });
    });

    this.startTimer();
  }

  getTemplateCode(lang: string): string {
    // ... (Template code remains the same)
    const templates: any = {
      python: `class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return max(maxDepth(root->left), maxDepth(root->right)) + 1;
    }
};`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}`
    };
    return templates[lang] || '';
  }

  onLanguageChange() {
    // 4. Use the class property 'this.monacoNamespace' instead of the inaccessible local 'monaco'
    if (this.editor && this.monacoNamespace) {
      const model = this.editor.getModel();
      this.monacoNamespace.editor.setModelLanguage(model, this.language); // Fix TS2304
      this.editor.setValue(this.getTemplateCode(this.language));
    }
  }

  // ... (Rest of the methods remain the same)

  runCode() {
    this.output = `Running tests...\n\nTest Case 1: Passed ✓\nTest Case 2: Passed ✓\nTest Case 3: Failed ✗ - Expected 4, got 3\n\nExecution time: 0.23ms`;
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
        alert('Time is up!');
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.editor) this.editor.dispose();
  }

  constructor(private router: Router) {}
}
