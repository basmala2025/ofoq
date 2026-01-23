import { CanDeactivateFn } from '@angular/router';
import { ExamEditorComponent } from '../student/exam-editor/exam-editor';

export const confirmExitGuard: CanDeactivateFn<ExamEditorComponent> = (component) => {
  if (component.isExamFinished) return true;
  return confirm("Warning: Your exam is still active! If you leave now, your progress will be lost. Stay on this page?");
};
