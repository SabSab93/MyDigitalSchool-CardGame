import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { DeckService } from '../../../services/deck/deck.service';
import { ShowDeckModalComponent } from '../../../modal/show-deck-modal/show-deck-modal.component';

@Component({
  selector: 'app-view-deck',
  standalone: true,
  imports: [CommonModule, ShowDeckModalComponent],
  templateUrl: './view-decks.component.html',
  styleUrls: ['./view-decks.component.scss']
})
export class ViewDeckComponent implements OnInit {
  decks: DeckWithCardsModel[] = [];
  selectedDeck: DeckWithCardsModel | null = null;

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.deckService.getAllDecks().subscribe({
      next: decks => this.decks = decks,
      error: err => console.error('Erreur récupération decks :', err)
    });
  }

  selectDeck(deck: DeckWithCardsModel) {
    console.log('Deck sélectionné →', deck);
    console.log('deck.cards =', deck.cards);
    this.selectedDeck = deck;
  }

  closeModal() {
    this.selectedDeck = null;
  }
  getTotalValue(deck: DeckWithCardsModel): number {
    return deck.cards.reduce((acc, card) => acc + card.value, 0);
  }
}
