import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../service/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent implements OnInit {

  allPosts: any[] = [];

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const keyword = params['q'];
      if (keyword && keyword.trim().length > 0) {
        this.searchPosts(keyword.trim());
      } else {
        this.getAllPosts();
      }
    });
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts = res;
      },
      error: () => {
        this.snackBar.open("Error while fetching posts", "Close", { duration: 3000 });
      }
    });
  }

  searchPosts(keyword: string) {
    this.postService.searchByName(keyword).subscribe({
      next: (res) => {
        this.allPosts = res;
      },
      error: () => {
        this.snackBar.open("Error while searching posts", "Close", { duration: 3000 });
      }
    });
  }
}