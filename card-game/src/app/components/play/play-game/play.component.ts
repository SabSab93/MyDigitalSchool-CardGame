// src/app/play/play.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ActivatedRoute, RouterModule }    from '@angular/router';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { DeckService } from '../../../services/deck/deck.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [ CommonModule, RouterModule],   // ← On importe CommonModule pour NgIf, JsonPipe…
  template: `
    <ng-container *ngIf="deck; else loading">
      <div class="play-container">
        <h2>Jeu – Deck : {{ deck.name }}</h2>
        <pre>Cartes : {{ deck.cards | json }}</pre>
        <!-- TODO : lancez ici le début de la partie -->
      </div>
    </ng-container>
    <ng-template #loading>
      <p>Chargement du deck…</p>
    </ng-template>
  `,
  styles: [`
    .play-container {
      padding: 1rem;
      font-family: monospace;
    }
  `]
})
export class PlayComponent implements OnInit {
  deck?: DeckWithCardsModel;

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    const deckId = this.route.snapshot.paramMap.get('deckId');
    if (deckId) {
      this.deckService.getAllDecks().subscribe(decks => {
        this.deck = decks.find(d => d.id === deckId);
      });
    }
  }
}
