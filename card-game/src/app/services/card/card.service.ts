// src/app/services/card/card.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CardModel } from '../../types/cardModel-type';

interface CardBasic {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  /** Récupère d’abord id+name, puis pour chaque id la carte complète (avec value) */
  getAllCards(): Observable<CardModel[]> {
    return this.http.get<CardBasic[]>(this.apiUrl).pipe(
      switchMap((basics) => {
        if (!basics || basics.length === 0) {
          return of([]);
        }
        // Pour chaque basic, on fait une requête GET /api/cards/:id
        const calls = basics.map(b =>
          this.http.get<CardModel>(`${this.apiUrl}/${b.id}`)
        );
        return forkJoin(calls);
      })
    );
  }
  createCard(card: Partial<CardModel>): Observable<CardModel> {
    return this.http.put<CardModel>(this.apiUrl, card);
  }
  updateCard(card: CardModel): Observable<CardModel> {
    return this.http.post<CardModel>(this.apiUrl, card);
  }
}