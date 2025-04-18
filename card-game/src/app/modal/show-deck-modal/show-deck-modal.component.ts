import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckWithCardsModel } from '../../types/deckModel-type';
import { ShowCardComponent } from '../show-card-modal/show-card-modal.component';
import { CardModel } from '../../types/cardModel-type';

@Component({
  selector: 'app-show-deck-modal',
  standalone: true,
  imports: [CommonModule, ShowCardComponent],
  templateUrl: './show-deck-modal.component.html',
  styleUrls: ['./show-deck-modal.component.scss']
})
export class ShowDeckModalComponent {
    @Input() deck!: DeckWithCardsModel;
    @Output() close = new EventEmitter<void>();
    
    currentIndex = 0;
    
    get currentCard(): CardModel | null {
      return this.deck?.cards?.[this.currentIndex] || null;
    }
    get hasCards(): boolean {
        return !!this.deck && Array.isArray(this.deck.cards) && this.deck.cards.length > 0;
    }
      
    get hasMultipleCards(): boolean {
        return !!this.deck && this.deck.cards.length > 1;
    }
    
    nextCard() {
      if (this.deck?.cards?.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.deck.cards.length;
      }
    }
    
    prevCard() {
      if (this.deck?.cards?.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + this.deck.cards.length) % this.deck.cards.length;
      }
    }

    
}
