import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { DeckService } from '../../../services/deck/deck.service';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-deck',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.scss']
})
export class EditDeckComponent implements OnInit {
  decks: DeckWithCardsModel[] = [];
  selectedDeck: DeckWithCardsModel | null = null;
  deckName = '';
  selectedCards: CardModel[] = [];
  availableCards: CardModel[] = [];
  isDeckUpdated = false;

  constructor(
    private deckService: DeckService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.deckService.getAllDecks().subscribe({
      next: decks => this.decks = decks,
      error: err => console.error('Erreur récupération des decks:', err)
    });
    this.cardService.getAllCards().subscribe({
      next: cards => this.availableCards = cards,
      error: err => console.error('Erreur récupération des cartes:', err)
    });
  }

  selectDeck(deck: DeckWithCardsModel) {
    this.selectedDeck = { ...deck, cards: [...deck.cards] }; // copie défensive
    this.deckName = deck.name;
    this.selectedCards = [...deck.cards];
    this.isDeckUpdated = false;
  }

  getTotalValue(deck: DeckWithCardsModel): number {
    return deck.cards.reduce((acc, card) => acc + (card.value || 0), 0);
  }

  validateDeck(): boolean {
    return (
      this.deckName.trim().length > 0 &&
      this.selectedCards.length <= 5 &&
      this.getTotalValue(this.selectedDeck!) <= 30
    );
  }

  addCard(card: CardModel) {
    if (this.selectedCards.length < 5 && !this.selectedCards.find(c => c.id === card.id)) {
      this.selectedCards.push(card);
    }
  }

  removeCard(card: CardModel) {
    this.selectedCards = this.selectedCards.filter(c => c.id !== card.id);
  }

  updateDeck() {
    if (!this.selectedDeck || !this.selectedDeck.id) {
      console.error('Deck sélectionné ou ID manquant');
      return;
    }
  
    const updatedDeck: { id: string; name: string; cards: string[] } = {
      id: this.selectedDeck.id,
      name: this.deckName,
      cards: this.selectedCards.map(card => card.id)
    };
  
    console.log('Données envoyées pour mise à jour du deck:', updatedDeck);
  
    // Utilisation de `POST` au lieu de `PATCH` car le backend attend une requête POST
    this.deckService.updateDeck(updatedDeck).subscribe({
      next: updated => {
        console.log('Deck mis à jour avec succès:', updated);
        const index = this.decks.findIndex(d => d.id === updated.id);
        if (index > -1) {
          this.decks[index] = { ...updated, cards: this.selectedCards };
        }
        this.selectedDeck = null;
      },
      error: err => {
        console.error('Erreur mise à jour du deck:', err);
        if (err.status === 400) {
          console.error('Mauvaise requête:', err.message);
        } else if (err.status === 500) {
          console.error('Erreur serveur:', err.message);
        } else {
          console.error('Autre erreur:', err.message);
        }
      }
    });
  }
  
}
