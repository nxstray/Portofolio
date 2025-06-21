import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GoogleAuthProvider, signInWithPopup, UserCredential, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  template: `
    <mat-card>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">
          {{ isLoginMode ? 'Login' : 'Sign Up' }}
        </button>
        <button mat-button type="button" (click)="toggleMode()">
          Switch to {{ isLoginMode ? 'Sign Up' : 'Login' }}
        </button>
        <button mat-raised-button color="accent" type="button" (click)="signInWithGoogle().subscribe()">
          Sign in with Google
        </button>
      </form>
    </mat-card>
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loginForm!: FormGroup;
  apiUrl = 'http://localhost:3000/api'; // Set your API URL here
  loggedIn = { next: (val: boolean) => {} }; // Replace with your actual Subject/BehaviorSubject if needed
  auth = getAuth();

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;
    if (this.isLoginMode) {
      this.authService.signIn(email!, password!).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: any) => alert(err.error),
      });
    } else {
      this.authService.signUp(email!, password!).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: any) => alert(err.error),
      });
    }
  }

  signInWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((cred: UserCredential) => cred.user.getIdToken()),
      switchMap((idToken: string) =>
        this.http.post(`${this.apiUrl}/google-signin`, { idToken }, { withCredentials: true })
      ),
      tap(() => this.loggedIn.next(true)),
      catchError((err: any) => {
        this.loggedIn.next(false);
        return throwError(() => err);
      })
    );
  }
}