import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardService } from '../../../services/card/card.service';
import { DeckService } from '../../../services/deck/deck.service';
import { CardModel } from '../../../types/cardModel-type';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { ShowDeckModalComponent } from '../../../modal/show-deck-modal/show-deck-modal.component';

@Component({
  selector: 'app-create-deck',
  standalone: true,
  imports: [CommonModule, FormsModule, ShowDeckModalComponent],
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss']
})
export class CreateDeckComponent implements OnInit {
  deckName = '';
  cards: CardModel[] = [];
  selectedCards: CardModel[] = [];
  createdDeck: DeckWithCardsModel | null = null;
  showModal = false;

  constructor(
    private cardService: CardService,
    private deckService: DeckService
  ) {}

  ngOnInit(): void {
    this.cardService.getAllCards().subscribe({
      next: data => this.cards = data,
      error: err => console.error('Erreur chargement cartes:', err)
    });
  }

  toggleCardSelection(card: CardModel) {
    const index = this.selectedCards.findIndex(c => c.id === card.id);
    if (index > -1) {
      this.selectedCards.splice(index, 1);
    } else if (this.selectedCards.length < 5 && this.totalValue + card.value <= 30) {
      this.selectedCards.push(card);
    }
  }

  get totalValue(): number {
    return this.selectedCards.reduce((sum, card) => sum + card.value, 0);
  }

  isCardSelected(card: CardModel): boolean {
    return this.selectedCards.some(c => c.id === card.id);
  }

  isDeckValid(): boolean {
    return (
      this.deckName.trim().length > 0 &&
      this.selectedCards.length === 5 &&
      this.totalValue <= 30
    );
  }

  createDeck() {
    if (!this.isDeckValid()) return;

    const deckData = {
      name: this.deckName.trim(),
      cards: this.selectedCards.map(c => c.id)
    };

    this.deckService.createDeck(deckData).subscribe({
      next: created => {
        this.createdDeck = {
          ...created,
          cards: this.selectedCards
        };
        this.showModal = true;
        this.resetForm();
      },
      error: err => console.error('Erreur création deck :', err)
    });
  }

  handleCloseModal() {
    this.showModal = false;
    this.createdDeck = null;
  }

  private resetForm() {
    this.selectedCards = [];
    this.deckName = '';
    this.cardService.getAllCards().subscribe({
      next: data => this.cards = data,
      error: err => console.error('Erreur chargement cartes:', err)
    });
  }
}
