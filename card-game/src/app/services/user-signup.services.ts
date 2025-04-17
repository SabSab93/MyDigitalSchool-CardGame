import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileModel } from '../types/profileModel-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserSignUpService {
  private userSubject = new BehaviorSubject<ProfileModel | null>(null);
  user$ = this.userSubject.asObservable();

  private baseUrl = 'http://localhost:3010/api'; 

  constructor(private http: HttpClient) {}

  signUp(user: ProfileModel): Observable<ProfileModel> {
    const { id, ...payload } = user;

    return this.http.put<ProfileModel>(`${this.baseUrl}/profiles`, payload);
  }

  private login(login: string, password: string, id: string | undefined) {
    this.http.post<{ token: string }>(`${this.baseUrl}/login`, { login, password }).subscribe({
      next: (res: { token: any }) => {
        const rawToken = res.token;
        console.log('Token reçu après login :', rawToken);

        localStorage.setItem('authToken', rawToken);

        if (id) {
          this.refreshToken(id, rawToken);
        }
      },
      error: (err) => console.error('Erreur au login :', err)
    });
  }

  private refreshToken(id: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: token
    });

    this.http.get<{ token: string }>(`${this.baseUrl}/token/refresh/${id}`, { headers }).subscribe({
      next: (res) => {
        console.log('Token rafraîchi :', res.token);
        localStorage.setItem('authToken', res.token); // Remplacer l'ancien
      },
      error: (err) => console.error('Erreur lors du refresh du token :', err)
    });
  }

  // Méthode pour capter les erreurs
  handleError(err: any): string {
    if (err.status === 404) {
      return 'Service non disponible. Veuillez réessayer plus tard.';
    } else {
      return 'Erreur lors de l’inscription. Veuillez réessayer.';
    }
  }
}
