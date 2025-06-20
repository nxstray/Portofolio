import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  postForm!: FormGroup;
  tags: string[] = [];
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      postedBy: [null, Validators.required]
    });
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: any) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }

  createPost() {
    const data = this.postForm.value;
    data.tags = this.tags;

    this.postService.createNewPost(data).subscribe({
      next: (createdPost) => {
        if (this.selectedImageFile) {
          this.postService.uploadImage(createdPost.id, this.selectedImageFile).subscribe({
            next: () => {
              this.snackBar.open('Post and image uploaded successfully!', 'Close', { duration: 3000 });
              this.router.navigateByUrl('/');
            },
            error: (err) => {
              this.snackBar.open('Post created, but failed to upload image.', 'Close', { duration: 3000 });
              console.error('Image upload failed:', err);
              this.router.navigateByUrl('/');
            }
          });
        } else {
          this.snackBar.open('Post created successfully!', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        this.snackBar.open('Error creating post.', 'Close', { duration: 3000 });
        console.error('Error creating post:', err);
      }
    });
  }
}