import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // أو المكان اللي مخزنة فيه التوكن

  if (token) {
    console.log('🔑 Token found, attaching to request...');
    // 🔴 الخطوة دي هي اللي بتلزق التوكن في الريكويست
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // تأكدي من كلمة Bearer والمسافة
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
