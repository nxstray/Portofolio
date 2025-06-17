import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-post',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent {

  postId: string;
  postData: any;

  constructor(private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {
      this.postId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
      console.log(this.postId);
      this.getPostById();
    }

    getPostById() {
      this.postService.getPostById(Number(this.postId)).subscribe({
        next: (res) => {
          console.log(res);
          this.postData = res;
        },
        error: () => {
          this.snackBar.open("Error while fetching post", "Close");
        }
      });
    }
}
