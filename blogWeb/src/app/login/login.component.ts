import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.signIn(this.email, this.password).subscribe({
      next: () => {
        this.success = 'Login success!';
        this.error = '';
      },
      error: err => {
        this.error = 'Login failed!';
        this.success = '';
      }
    });
  }
}