import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password }, { withCredentials: true }).pipe(
      tap(() => this.loggedIn.next(true)),
      catchError((err) => {
        this.loggedIn.next(false);
        return throwError(() => err);
      })
    );
  }

  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password }, { withCredentials: true }).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  checkLoginStatus(): void {
    this.http.get(`${this.apiUrl}/check`, { withCredentials: true }).subscribe({
      next: () => this.loggedIn.next(true),
      error: () => this.loggedIn.next(false),
    });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.loggedIn.next(false),
      error: () => this.loggedIn.next(false),
    });
  }
}