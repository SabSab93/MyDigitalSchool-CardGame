import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DeckModel, DeckWithCardsModel } from '../../types/deckModel-type';
import { CardModel } from '../../types/cardModel-type';
import { CardService } from '../card/card.service';

interface DeckBasic {
  id: string;
  name: string;
}

interface CreateDeckPayload {
  name: string;
  cards: string[]; // tableau d'ID de cartes
}

@Injectable({ providedIn: 'root' })
export class DeckService {
  private apiUrl = 'http://localhost:3000/api/decks';

  constructor(
    private http: HttpClient,
    private cardService: CardService
  ) {}

  /** Récupère tous les decks avec leurs cartes */
  getAllDecks(): Observable<DeckWithCardsModel[]> {
    return this.http.get<DeckBasic[]>(this.apiUrl).pipe(
      switchMap(decks => {
        if (!decks?.length) return of([]);
        const calls = decks.map(d =>
          this.http.get<{
            id: string;
            name: string;
            cards: string[] | CardModel[];
          }>(`${this.apiUrl}/${d.id}`)
        );
        return forkJoin(calls);
      }),
      switchMap((detailedDecks) =>
        this.cardService.getAllCards().pipe(
          map(allCards =>
            detailedDecks.map(d => ({
              id: d.id,
              name: d.name,
              cards: Array.isArray(d.cards) && typeof d.cards[0] === 'string'
                ? (d.cards as string[])
                    .map(id => allCards.find(c => c.id === id))
                    .filter((c): c is CardModel => !!c)
                : (d.cards as CardModel[])
            }))
          )
        )
      )
    );
  }

  /** Crée un nouveau deck */
  createDeck(deck: { name: string; cards: string[] }): Observable<DeckModel> {
    return this.http.put<DeckModel>(this.apiUrl, deck);
  }
  deleteDeck(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDeck(updatedDeck: { id: string; name: string; cards: string[] }) {
    return this.http.post<{ id: string; name: string; cards: string[] }>(
      this.apiUrl, updatedDeck
    );
  }

 }