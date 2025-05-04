import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight }    from '@fortawesome/free-solid-svg-icons';

import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { DeckService }        from '../../../services/deck/deck.service';
import { EditDeckPanelComponent } from '../edit-deck-panel/edit-deck-panel.component';


@Component({
  selector: 'app-edit-deck',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    EditDeckPanelComponent    // ← on importe le panel ici
  ],
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.scss']
})
export class EditDeckComponent implements OnInit {
  faChevronRight = faChevronRight;
  decks: DeckWithCardsModel[] = [];
  selectedDeck: DeckWithCardsModel | null = null;

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.deckService.getAllDecks().subscribe(d => this.decks = d);
  }

  selectDeck(d: DeckWithCardsModel) {
    this.selectedDeck = d;
  }

  closePanel() {
    this.selectedDeck = null;
  }

  getDeckValue(deck: DeckWithCardsModel): number {
    return deck.cards.reduce((sum, c) => sum + (c.value || 0), 0);
  }
}
