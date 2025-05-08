import { Component, OnInit } from '@angular/core';
import { Router, RouterModule }            from '@angular/router';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { DeckService }        from '../../../services/deck/deck.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-deck-selection',
  standalone: true,
  imports : [  CommonModule,  RouterModule],
  templateUrl: './play-deck-selection.component.html',
  styleUrls: ['./play-deck-selection.component.scss']
})
export class PlayDeckSelectionComponent implements OnInit {
  decks: DeckWithCardsModel[] = [];

  constructor(
    private deckService: DeckService,
    private router: Router
  ) {}

  ngOnInit() {
    this.deckService.getAllDecks().subscribe(decks => {
      this.decks = decks;
    });
  }


  stats(deck: DeckWithCardsModel): string {
    const count = deck.cards.length;
    const total = deck.cards.reduce((s, c) => s + (c.value || 0), 0);
    return `Cartes : ${count}/5 | Valeur : ${total}/30`;
  }


  select(deck: DeckWithCardsModel) {
    this.router.navigate(['/play', deck.id!]);
  }
}
