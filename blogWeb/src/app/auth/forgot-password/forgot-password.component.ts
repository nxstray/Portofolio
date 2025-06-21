import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (!this.resetForm.valid) return;

    const { emailOrUsername } = this.resetForm.value;

    this.authService.resetPassword(emailOrUsername).subscribe({
      next: () => {
        this.submitted = true;
        setTimeout(() => this.router.navigateByUrl('/auth'), 3000);
      },
      error: (err: any) => alert(err.error || 'Failed to send reset link.')
    });
  }
}