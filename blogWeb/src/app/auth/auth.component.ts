import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
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

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;
    const authObs = this.isLoginMode
      ? this.authService.signIn(email!, password!)
      : this.authService.signUp(email!, password!);

    authObs.subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: any) => alert(err.error)
    });
  }
}