import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { PostService } from './service/post.service';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

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
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    FormsModule
  ]
})
export class AppComponent implements OnInit {
  title = 'blogWeb';
  isLoggedIn$!: Observable<boolean>;
  searchResults: any[] = [];
  currentQuery: string = '';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.checkLoginStatus();
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }

  onSearchChange(): void {
    const query = this.currentQuery;
    if (query.length > 1) {
      this.postService.searchByName(query).subscribe({
        next: (res: any[]) => {
          this.searchResults = res;
        },
        error: (err: any) => {
          console.error(err);
          this.searchResults = [];
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  onSearchEnter(): void {
    if (this.currentQuery.trim()) {
      this.searchResults = []
      this.router.navigate(['/view-all'], { queryParams: { q: this.currentQuery.trim() } });
      this.currentQuery = '';
    } else if (this.searchResults.length > 1) {
      const matched = this.searchResults.find((r: any) =>
        r?.name?.toLowerCase().includes(this.currentQuery.toLowerCase())
      );
      if (matched) {
        this.goToPost(matched.id);
      }
    }
  }

  goToPost(postId: number): void {
    this.searchResults = [];
    this.currentQuery = '';
    this.router.navigate(['/post', postId]);
  }
}