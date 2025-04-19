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
  availableCards: CardModel[] = []; // Liste des cartes disponibles
  selectedCards: CardModel[] = []; // Cartes sélectionnées pour le deck
  deckName: string = ''; // Nom du deck à modifier

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
    this.selectedDeck = deck;
    this.deckName = deck.name;
    this.selectedCards = [...deck.cards]; // Copie des cartes du deck pour les modifier
  }

  addCard(card: CardModel) {
    if (this.selectedCards.length < 5) {
      this.selectedCards.push(card);
    }
  }

  removeCard(card: CardModel) {
    this.selectedCards = this.selectedCards.filter(c => c.id !== card.id);
  }

  getTotalValue(): number {
    return this.selectedCards.reduce((acc, card) => acc + (card.value || 0), 0);
  }

  validateDeck(): boolean {
    return (
      this.deckName.trim().length > 0 &&
      this.selectedCards.length <= 5 &&
      this.getTotalValue() <= 30
    );
  }

  saveDeck() {
    if (this.selectedDeck) {
      const updatedDeck = { ...this.selectedDeck, name: this.deckName, cards: this.selectedCards };
      this.deckService.updateDeck(updatedDeck).subscribe(() => {
        console.log('Deck mis à jour');
      });
    }
  }
}

