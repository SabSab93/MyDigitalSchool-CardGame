// src/app/services/game-service/game-service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CardModel } from '../../types/cardModel-type';

export interface GameState {
  userDeck: CardModel[];
  opponentDeck: CardModel[];
  userScore: number;
  opponentScore: number;
  currentRound: number;
  maxRounds: number;
  resultMessage: string;
  finished: boolean;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private state: GameState = {
    userDeck: [],
    opponentDeck: [],
    userScore: 0,
    opponentScore: 0,
    currentRound: 1,
    maxRounds: 5,
    resultMessage: '',
    finished: false,
  };
  private state$ = new BehaviorSubject<GameState>({ ...this.state });

  get game$(): Observable<GameState> {
    return this.state$.asObservable();
  }

  initGame(userCards: CardModel[]) {
    this.state = {
      ...this.state,
      userDeck: [...userCards],
      opponentDeck: this.generateOpponentDeck(),
      userScore: 0,
      opponentScore: 0,
      currentRound: 1,
      resultMessage: '',
      finished: false,
    };
    this.state$.next(this.state);
  }

  private generateOpponentDeck(): CardModel[] {
    let remaining = 30;
    const count = 5;
    const deck: CardModel[] = [];
    for (let i = 1; i <= count; i++) {
      const slotsLeft = count - i;
      const maxVal = Math.min(20, remaining);
      const val = (slotsLeft === 0)
        ? remaining
        : Math.floor(Math.random() * (maxVal + 1));
      remaining -= val;
      deck.push({
        id: `opp-${i}`,
        name: `Opp ${i}`,
        value: val,
        imageUrl: `/assets/images/cards/card_${val}.png`
      });
    }
    return deck;
  }


  playTurn(
    userCard: CardModel
  ): { opponentCard: CardModel; resultMessage: string; finished: boolean } {

    const userDeck = this.state.userDeck.filter(c => c.id !== userCard.id);
    const oppDeck = [...this.state.opponentDeck];
    const idx = Math.floor(Math.random() * oppDeck.length);
    const oppCard = oppDeck.splice(idx, 1)[0];

    // résultat du tour
    let message = '';
    if (userCard.value > oppCard.value) {
      this.state.userScore++;
      message = 'Tu as gagné ce tour ! 🎉';
    } else if (userCard.value < oppCard.value) {
      this.state.opponentScore++;
      message = 'L’adversaire a gagné ce tour. 😢';
    } else {
      message = 'Égalité ce tour ! 🤝';
    }

    const nextRound = this.state.currentRound + 1;
    const finished = 
      nextRound > this.state.maxRounds ||
      userDeck.length === 0 ||
      oppDeck.length === 0;

    let finalMsg = message;
    if (finished) {
      if (userDeck.length === 0) {
        finalMsg = 'Tu n\'as plus de cartes. Tu as perdu 😭';
      } else if (oppDeck.length === 0) {
        finalMsg = 'L\'adversaire n\'a plus de cartes. Tu as gagné 🏆';
      } else if (this.state.userScore > this.state.opponentScore) {
        finalMsg = 'Bravo, tu remportes la partie ! 🏆';
      } else if (this.state.userScore < this.state.opponentScore) {
        finalMsg = 'Dommage, l’adversaire gagne la partie. 😭';
      } else {
        finalMsg = 'Match nul final. 🤝';
      }
    }

    // mise à jour de l’état
    this.state = {
      ...this.state,
      userDeck,
      opponentDeck: oppDeck,
      currentRound: nextRound,
      resultMessage: finalMsg,
      finished,
    };
    this.state$.next(this.state);

    return {
      opponentCard: oppCard,
      resultMessage: finalMsg,
      finished
    };
  }
}
