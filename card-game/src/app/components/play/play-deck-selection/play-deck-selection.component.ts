// src/app/play/play-deck-selection/play-deck-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Router }           from '@angular/router';
import { DeckService }      from '../../../services/deck/deck.service';
import { DeckWithCardsModel } from '../../../types/deckModel-type';

@Component({
  selector: 'app-play-deck-selection',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    <h3>Choisissez un deck pour jouer :</h3>
    <ul class="deck-list">
      <li *ngFor="let deck of decks"
          (click)="select(deck)"
          [title]="stats(deck)">
        {{ deck.name }}
      </li>
    </ul>
  `,
  styles: [`
    .deck-list { list-style:none; columns:2; column-gap:1rem; padding:0; }
    .deck-list li { padding:.5rem; cursor:pointer; transition:background .2s; }
    .deck-list li:hover { background:rgba(149,125,173,.2); }
  `]
})
export class PlayDeckSelectionComponent implements OnInit {
  decks: DeckWithCardsModel[] = [];

  constructor(
    private deckService: DeckService,
    private router: Router
  ) {}

  ngOnInit() {
    this.deckService.getAllDecks().subscribe(d => this.decks = d);
  }

  stats(deck: DeckWithCardsModel): string {
    const count = deck.cards.length;
    const total = deck.cards.reduce((sum, c) => sum + (c.value || 0), 0);
    return `Cartes : ${count}/5 — Valeur : ${total}/30`;
  }

  select(deck: DeckWithCardsModel) {
    if (!deck.id) return;             
    this.router.navigate(['/play', deck.id]);
  }
}
