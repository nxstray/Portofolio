import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../service/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent {
  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllposts();
  }

  getAllposts() {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: () => {
        this.snackBar.open("Error while fetching posts", "Close");
      }
    });
  }
}