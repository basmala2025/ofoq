import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { authInterceptor } from './auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),

    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));
