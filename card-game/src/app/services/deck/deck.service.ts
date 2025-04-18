// src/app/services/deck/deck.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DeckWithCardsModel } from '../../types/deckModel-type';
import { CardModel } from '../../types/cardModel-type';
import { CardService } from '../card/card.service';

interface DeckBasic {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DeckService {
  private deckUrl = 'http://localhost:3000/api/decks';
  constructor(
    private http: HttpClient,
    private cardService: CardService
  ) {}

  /** Récupère d’abord les decks basiques, puis pour chacun va chercher /api/decks/:id qui doit renvoyer les cartes liées */
  getAllDecks(): Observable<DeckWithCardsModel[]> {
    return this.http.get<DeckBasic[]>(this.deckUrl).pipe(
      switchMap(decks => {
        if (!decks?.length) return of([]);
        // Pour chaque deck basique, on appelle /api/decks/:id
        const calls = decks.map(d =>
          this.http.get<{
            id: string;
            name: string;
            cards: string[]; // ou CardModel[] si ton endpoint le renvoie
          }>(`${this.deckUrl}/${d.id}`)
        );
        return forkJoin(calls);
      }),
      // À ce stade on a pour chaque deck {id,name,cards: string[]}
      switchMap((detailedDecks) =>
        // si ce detailedDecks renvoie cards: string[], on doit enrichir en CardModel[]
        this.cardService.getAllCards().pipe(
          map(allCards =>
            detailedDecks.map(d => ({
              id: d.id,
              name: d.name,
              cards: Array.isArray(d.cards) && typeof d.cards[0] === 'string'
              ? (d.cards as unknown as string[])
                  .map(id => allCards.find(c => c.id === id))
                  .filter((c): c is CardModel => !!c)
              : (d.cards as unknown as CardModel[])
            }))
          )
        )
      )
    );
  }
}
