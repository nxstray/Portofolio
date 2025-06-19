import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterModule
  ]
})
export class AppComponent implements OnInit {
  title = 'blogWeb';
  isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkLoginStatus();
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }
}