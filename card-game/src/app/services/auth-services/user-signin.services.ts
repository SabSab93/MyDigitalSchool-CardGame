import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSignInService {
  private baseUrl = 'http://localhost:3010/api';

  constructor(private http: HttpClient) {}

  signIn(login: string, password: string): Observable<string> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { login, password }).pipe(
      map((res) => {
        localStorage.setItem('authToken', res.token);
        return res.token;
      }),
      catchError((err) => {
        console.error('Erreur de connexion :', err);
        return throwError(() => new Error('Erreur lors de la connexion. Veuillez réessayer.'));
      })
    );
  }
}
