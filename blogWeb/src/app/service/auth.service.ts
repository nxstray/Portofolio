import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signin`, { email, password }, { withCredentials: true })
      .pipe(
        tap(() => this.loggedIn.next(true)),
        catchError((err) => {
          this.loggedIn.next(false);
          return throwError(() => err);
        })
      );
  }

  signUp(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signup`, { email, password }, { withCredentials: true })
      .pipe(
        tap(() => this.loggedIn.next(true)),
        catchError((err) => {
          this.loggedIn.next(false);
          return throwError(() => err);
        })
      );
  }

  resetPassword(emailOrUsername: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { emailOrUsername }, { withCredentials: true });
  }

  checkLoginStatus(): void {
    this.http.get(`${this.apiUrl}/check`, { withCredentials: true }).subscribe({
      next: () => this.loggedIn.next(true),
      error: () => this.loggedIn.next(false),
    });
  }

  checkLoginStatusWithResponse(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/check`, { withCredentials: true }).pipe(
      map(() => {
        this.loggedIn.next(true);
        return true;
      }),
      catchError(() => {
        this.loggedIn.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.loggedIn.next(false),
      error: () => this.loggedIn.next(false),
    });
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}