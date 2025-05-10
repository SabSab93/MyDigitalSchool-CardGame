import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { CardModel }          from '../../../types/cardModel-type';
import { DeckService }        from '../../../services/deck/deck.service';
import { CardService }        from '../../../services/card/card.service';

@Component({
  selector: 'app-edit-deck-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './edit-deck-panel.component.html',
  styleUrls: ['./edit-deck-panel.component.scss']
})
export class EditDeckPanelComponent implements OnInit {
  @Input()  deck!: DeckWithCardsModel;
  @Output() close = new EventEmitter<void>();

  faPlus  = faPlus;
  faMinus = faMinus;
  faTimes = faTimes;

  deckName       = '';
  selectedCards: CardModel[] = [];
  allCards:      CardModel[] = [];

  constructor(
    private cardService: CardService,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    this.deckName      = this.deck.name;
    this.selectedCards = [...this.deck.cards];
    this.cardService.getAllCards().subscribe(c => this.allCards = c);
  }


  getCardCount(): number {
    return this.selectedCards.length;
  }


  getDeckValue(): number {
    return this.selectedCards.reduce((s, c) => s + (c.value||0), 0);
  }


  add(card: CardModel) {
    if (this.canAdd(card)) {
      this.selectedCards.push(card);
    }
  }


  remove(card: CardModel) {
    this.selectedCards = this.selectedCards.filter(x => x.id !== card.id);
  }


  canAdd(card: CardModel): boolean {
    return (
      this.getCardCount() < 5 &&
      this.getDeckValue() + (card.value||0) <= 30 &&
      !this.selectedCards.some(x => x.id === card.id)
    );
  }


  canValidate(): boolean {
    return (
      this.deckName.trim().length > 0 &&
      this.getCardCount() === 5 &&
      this.getDeckValue() <= 30
    );
  }

  save() {
    if (!this.deck.id || !this.canValidate()) return;
    const payload = {
      id:    this.deck.id,
      name:  this.deckName.trim(),
      cards: this.selectedCards.map(c => c.id)
    };
    this.deckService.updateDeck(payload).subscribe({
      next: () => this.close.emit(),
      error: err => console.error('Erreur update deck:', err)
    });
  }
}
