import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../service/comment.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-post',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent {

  postId: string;
  postData: any;
  comments: any;

  commentForm!: FormGroup;

  constructor(private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private commentService: CommentService) {
      this.postId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
      console.log(this.postId);
      console.log("ViewPostComponent loaded");
      this.getPostById();

      this.commentForm = this.fb.group({
        postedBy: [null, Validators.required],
        content: [null, Validators.required]
      })
    }

    publishComment() {
      const postedBy = this.commentForm.get('postedBy')?.value;
      const content = this.commentForm.get('content')?.value;

      this.commentService.createComment(Number(this.postId), postedBy, content).subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.open("Comment added successfully", "Close", { duration: 3000});
          this.commentForm.reset();
          this.getCommentsByPostId();
        },
        error: () => {
          this.snackBar.open("Error while adding comment", "Close", { duration: 3000});
        }
      });
    }

    getCommentsByPostId() {
      this.commentService.getAllCommentsByPostId(Number(this.postId)).subscribe({
        next: (res) => {
          console.log(res);
          this.comments = res;
        },
        error: () => {
          this.snackBar.open("Error while fetching comments", "Close", { duration: 3000});
        }
      });
    }

    getPostById() {
      this.postService.getPostById(Number(this.postId)).subscribe({
        next: (res) => {
          console.log(res);
          this.postData = res;
          this.getCommentsByPostId();
        },
        error: () => {
          this.snackBar.open("Error while fetching post", "Close", { duration: 3000});
        }
      });
    }
}
