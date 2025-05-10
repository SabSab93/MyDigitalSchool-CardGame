// src/app/components/play/play-game/play.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CardModel } from '../../../types/cardModel-type';
import { DeckService } from '../../../services/deck/deck.service';
import { AppPlayModalComponent } from '../app-play-modal/app-play-modal.component';
import { GameService, GameState } from '../../../services/game-service/game-service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, AppPlayModalComponent, RouterModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  currentRound = 1;
  maxRounds = 0;
  userScore = 0;
  opponentScore = 0;
  cards: CardModel[] = [];

  chosenCard?: CardModel;
  showConfirmation = false;
  showModal = false;
  flipped = false;
  opponentCard?: CardModel;
  showResult = false;
  resultMessage = '';

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.gameService.game$.subscribe((s: GameState) => {
      this.currentRound  = s.currentRound;
      this.maxRounds     = s.maxRounds;
      this.userScore     = s.userScore;
      this.opponentScore = s.opponentScore;
      this.cards         = s.userDeck;

      // si on vient de fermer la modale, on reset l’animation
      if (!s.finished) {
        this.showModal  = false;
        this.flipped    = false;
        this.showResult = false;
      }
    });

    const deckId = this.route.snapshot.paramMap.get('deckId')!;
    this.deckService.getAllDecks().subscribe(decks => {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        this.gameService.initGame(deck.cards);
      }
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


    const { opponentCard, resultMessage, finished } =
      this.gameService.playTurn(this.chosenCard);

    this.opponentCard  = opponentCard;
    this.resultMessage = resultMessage;
    this.showModal     = true;
    this.animateBattle(finished);
  }

  private animateBattle(finished: boolean = false) {
    this.flipped = false;
    setTimeout(() => {
      this.flipped = true;
      setTimeout(() => {
        this.showResult = true;

        if (finished) {

        }
      }, 500);
    }, 100);
  }

  closeBattle() {
    this.showResult     = false;
    this.chosenCard     = undefined;
    this.showModal      = false;
    this.flipped        = false;
  }

  cancelChoice() {
    this.chosenCard = undefined;
    this.showConfirmation = false;
  }

  onDialogClick() {
    if (this.showConfirmation) return;
    if (this.chosenCard && !this.showModal) {
      this.confirmChoice();
    } else if (this.showResult) {
      this.closeBattle();
    }
  }
}
