import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { App} from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),

    provideRouter(routes, withHashLocation()),

    importProvidersFrom(ReactiveFormsModule) // ✅ الحل هنا
  ]
}).catch(err => console.error(err));
