import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { LiveDashboard } from './dashboard/livedashboard/livedashboard';
import { SessionSummary } from './dashboard/summary/summary';
import { DashboardPageComponent } from './student/dashboard-page/dashboard-page';
import { CourseDetails } from './dashboard/course-details/course-details';
import { Profprofile } from './profprofile/profprofile';
import { Stdprofile } from './student/stdprofile/stdprofile';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path:'home',component:Home},
    { path: 'signup', component: Signup },
    { path: 'login', component: Login },
     { path: 'dashboard', component: Dashboard },
{
    path: 'livedashboard/:id',
    loadComponent: () => import('./dashboard/livedashboard/livedashboard').then(m => m.LiveDashboard)
  },     { path: 'summary', component: SessionSummary },
     { path: 'courses', loadComponent: () => import('./student/course-selection/course-selection').then(m => m.CoursesPageComponent) },
      { path: 'dashboardstudent', loadComponent: () => import('./student/dashboard-page/dashboard-page').then(m => m.DashboardPageComponent) },
      { path: 'exam', loadComponent: () => import('./student/exam-editor/exam-editor').then(m => m.ExamEditorComponent) },
  { path: 'results', loadComponent: () => import('./student/results/results').then(m => m.Results) },
  { path: 'course/:id', component: CourseDetails },
  { path: 'profile', component: Profprofile },
  { path: 'stdprofile', component: Stdprofile },

];



