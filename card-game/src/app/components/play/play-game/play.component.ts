
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CardModel } from '../../../types/cardModel-type';
import { DeckService } from '../../../services/deck/deck.service';
import { AppPlayModalComponent } from '../app-play-modal/app-play-modal.component';
import { GameService, GameState } from '../../../services/game-service/game-service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, AppPlayModalComponent, RouterModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  game$!: Observable<GameState>;       
  chosenCard?: CardModel;
  showConfirmation = false;
  showModal = false;
  flipped = false;
  showResult = false;

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    const deckId = this.route.snapshot.paramMap.get('deckId')!;
    this.deckService.getAllDecks().subscribe(decks => {
      const deck = decks.find(d => d.id === deckId);
      if (deck) this.gameService.initGame(deck.cards);
    });
  }

  chooseCard(c: CardModel) {
    if (this.chosenCard) return;
    this.chosenCard = c;
    this.showConfirmation = true;
  }

  confirmChoice() {
    if (!this.chosenCard) return;
    this.showConfirmation = false;
    const { opponentCard } = this.gameService.playTurn(this.chosenCard);
    this.animateBattle(opponentCard);
  }

  private animateBattle(oppCard: CardModel) {

  }

  cancelChoice() { this.chosenCard = undefined; this.showConfirmation = false; }
  onDialogClick() {  }
}