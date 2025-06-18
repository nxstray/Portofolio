import { Component } from '@angular/core';
import { PostService } from '../service/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-by-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    RouterModule
    
  ],
  templateUrl: './search-by-name.component.html',
  styleUrls: ['./search-by-name.component.scss']
})
export class SearchByNameComponent {

  results: any = [];
  name:any = "";

  constructor(private postService: PostService,
    private snackBar: MatSnackBar) {}

    searchByName() {
      this.postService.searchByName(this.name).subscribe({
        next: (res) => {
          console.log(res);
          this.results = res;
        }, error: () => {
          this.snackBar.open("Error while searching posts", "Close", { duration: 3000 });
        }
      })
    }
}
