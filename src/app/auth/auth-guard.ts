import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');

  return token ? true : router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');

  if (token && userRole) {
    const target = userRole === 'student' ? '/courses' : '/dashboard';
    return router.createUrlTree([target]);
  }
  return true;


};

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('userRole');
  const expectedRole = route.data['role'];

  if (userRole === expectedRole) {
    return true;
  }

if (userRole?.toLowerCase() === expectedRole?.toLowerCase()) {
    return true;
}
  if (userRole === 'student') return router.createUrlTree(['/courses']);
  if (userRole === 'professor') return router.createUrlTree(['/dashboard']);
  if (userRole === 'super_admin') return router.createUrlTree(['/admin-dashboard']);

  localStorage.clear();
  return router.createUrlTree(['/login']);
};
