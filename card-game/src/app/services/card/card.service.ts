import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CardModel } from '../../types/cardModel-type';

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  getAllCards(): Observable<CardModel[]> {
    return this.http.get<CardModel[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des cartes :', err);
        return throwError(() => new Error('Impossible de récupérer les cartes.'));
      })
    );
  }
}
