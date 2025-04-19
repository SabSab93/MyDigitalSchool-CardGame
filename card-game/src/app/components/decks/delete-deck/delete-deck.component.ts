import { Component } from '@angular/core';
import { DeckService } from '../../../services/deck/deck.service';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { CardModel } from '../../../types/cardModel-type';
import { DeleteDeckModalComponent } from '../../../modal/delete-deck-modal/delete-deck-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [CommonModule, FormsModule, DeleteDeckModalComponent],
    selector: 'app-delete-deck',
    templateUrl: './delete-deck.component.html',
    styleUrls: ['./delete-deck.component.scss']
})
export class DeleteDeckComponent {
  decks: DeckWithCardsModel[] = [];
  selectedDeck: DeckWithCardsModel | null = null;
  isModalVisible = false;

  constructor(private deckService: DeckService) {
    this.loadDecks();
  }

  loadDecks() {
    this.deckService.getAllDecks().subscribe((decks) => {
      this.decks = decks;
    });
  }

  selectDeck(deck: DeckWithCardsModel) {
    this.selectedDeck = deck;
    this.isModalVisible = true;
  }

  onCancel() {
    this.isModalVisible = false;
    this.selectedDeck = null;
  }

  onConfirmDelete() {
    if (this.selectedDeck) {
      // Logique pour supprimer le deck, par exemple :
      this.deckService.deleteDeck(this.selectedDeck.id!).subscribe(() => {
        this.loadDecks();  // Recharger les decks après suppression
        this.onCancel();  // Fermer le modal
      });
    }
  }

  getTotalValue(deck: DeckWithCardsModel): number {
    return deck.cards.reduce((sum, card) => sum + (card.value || 0), 0);
  }
}
