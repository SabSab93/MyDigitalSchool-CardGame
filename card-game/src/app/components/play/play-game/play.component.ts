import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ActivatedRoute, RouterModule }    from '@angular/router';
import { AppModalComponent } from '../../../modal/app-modal/app-modal.component';
import { DeckWithCardsModel } from '../../../types/deckModel-type';
import { CardModel } from '../../../types/cardModel-type';
import { DeckService } from '../../../services/deck/deck.service';


@Component({
  selector: 'app-play',
  standalone: true,
  imports: [ CommonModule, AppModalComponent, RouterModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  stage = 0;
  deck?: DeckWithCardsModel;
  cards: CardModel[] = [];
  chosenCard?: CardModel;
  opponentCard!: CardModel;
  showModal = false;
  flipped = false;

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    const deckId = this.route.snapshot.paramMap.get('deckId')!;
    this.deckService.getAllDecks().subscribe(decks => {
      this.deck = decks.find(d => d.id === deckId);
      if (this.deck) {
        this.cards = [...this.deck.cards];
        this.opponentCard = {
          id:    'opp-01',
          name:  'Adversaire',
          value: 10,
          imageUrl: `/assets/images/cards/card_10.png`
        } as CardModel;
      }
    });
  }

  nextStage() {
    this.stage = 1;
  }

  chooseCard(c: CardModel) {
    this.chosenCard = c;
    this.stage = 2;
    this.showModal = true;
    setTimeout(() => this.flipped = true, 300);
  }

  closeBattle() {
    this.showModal = false;
    this.flipped = false;
    this.chosenCard = undefined;
    this.stage = 1;
  }
}