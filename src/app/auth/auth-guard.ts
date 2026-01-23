import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * 1. Auth Guard:
 * وظيفته: يمنع أي حد مش مسجل دخول إنه يفتح صفحات الداش بورد.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');

  if (token) {
    return true; // مسموح له يمر
  } else {
    return router.createUrlTree(['/login']); // ارجع للوجن
  }
};

/**
 * 2. Guest Guard (الحل لمشكلتك):
 * وظيفته: لو الدكتور أو الطالب مسجل دخول، يمنعه يرجع لصفحة الـ Landing أو الـ Login.
 */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');

  if (token) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // لو مسجل، وديه لصفحته فوراً بدل الـ Landing
    const target = user.userType === 'professor' ? '/dashboard' : '/dashboardstudent';
    return router.createUrlTree([target]);
  }
  return true; // مسموح له يدخل اللوجن لو مش مسجل أصلاً
};

/**
 * 3. Role Guard:
 * وظيفته: يتأكد إن الطالب ميروحش لصفحات الدكتور والعكس.
 */
export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const expectedRole = route.data['role']; // بناخد الرتبة المطلوبة من ملف الـ routes

  if (user.userType === expectedRole) {
    return true;
  } else {
    // لو طالب حاول يفتح صفحة دكتور، نرجعه لصفحته هو
    const target = user.userType === 'professor' ? '/dashboard' : '/dashboardstudent';
    return router.createUrlTree([target]);
  }
};
