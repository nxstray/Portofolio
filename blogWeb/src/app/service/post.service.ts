import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:9090/';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  createNewPost(data: any): Observable<any> {
    return this.http.post(BASIC_URL + `api/posts`, data, { withCredentials: true });
  }

  uploadImage(postId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(BASIC_URL + `api/posts/${postId}/upload-image`, formData, { withCredentials: true });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(BASIC_URL + `api/posts`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/posts/${postId}`);
  }

  searchByName(name: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/posts/search/${name}`);
  }
}