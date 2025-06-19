import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.signUp(this.email, this.password).subscribe({
      next: () => {
        this.success = 'Registration successful!';
        this.error = '';
      },
      error: err => {
        this.error = 'Registration failed!';
        this.success = '';
      }
    });
  }
}
