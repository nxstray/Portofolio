import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'create-post',
    loadComponent: () =>
      import('./pages/create-post/create-post.component').then(
        (m) => m.CreatePostComponent
      ),
  },
  {
    path: 'view-all',
    loadComponent: () =>
      import('./pages/view-all/view-all.component').then(
        (m) => m.ViewAllComponent
      ),
  },
  {
    path: 'view-post/:id',
    loadComponent: () =>
      import('./pages/view-post/view-post.component').then(
        (m) => m.ViewPostComponent
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupComponent),
  },
];