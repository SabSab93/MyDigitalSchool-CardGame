
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CardModel } from '../../../types/cardModel-type';
import { DeckService } from '../../../services/deck/deck.service';
import { AppPlayModalComponent } from '../app-play-modal/app-play-modal.component';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, AppPlayModalComponent, RouterModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  cards: CardModel[] = [];
  opponentDeck: CardModel[] = [];

  currentRound = 1;
  readonly maxRounds = 5;
  userScore = 0;
  opponentScore = 0;

  chosenCard?: CardModel;
  showConfirmation = false;

  opponentCard?: CardModel;
  showModal = false;
  flipped = false;
  showResult = false;
  resultMessage = '';

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    const deckId = this.route.snapshot.paramMap.get('deckId')!;
    this.deckService.getAllDecks().subscribe(decks => {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        this.cards = [...deck.cards];
        this.generateOpponentDeck();
      }
    });
  }

  /** Génère 5 cartes adversaire (valeurs 0–20, somme ≤ 30) */
  private generateOpponentDeck() {
    let remaining = 30;
    const count = 5;
    this.opponentDeck = [];

    for (let i = 1; i < count; i++) {
      const slotsLeft = count - i;
      // max pour cette carte : min(20, remaining)
      const maxVal = Math.min(20, remaining);
      // si on est au dernier slot, on prend tout ce qui reste
      const val = (slotsLeft === 1)
        ? remaining
        : Math.floor(Math.random() * (maxVal + 1));
      remaining -= val;

      this.opponentDeck.push({
        id: `opp-${i}`,
        name: `Opp ${i+1}`,
        value: val,
        imageUrl: `/assets/images/cards/card_${val}.png`
      });
    }
  }

  /** 1) Clic sur ta carte → confirmation */
  chooseCard(c: CardModel) {
    if (this.chosenCard || this.currentRound > this.maxRounds) return;
    this.chosenCard = c;
    this.showConfirmation = true;
  }

  /** 2) Confirmé → lance le combat */
  confirmChoice() {
    if (!this.chosenCard) return;
    this.showConfirmation = false;

    // retire ta carte
    this.cards = this.cards.filter(c => c !== this.chosenCard);

    // adversaire choisit aléatoirement et retire sa carte
    const idx = Math.floor(Math.random() * this.opponentDeck.length);
    this.opponentCard = this.opponentDeck.splice(idx, 1)[0];

    // ouvre la modal + flip + résultat
    setTimeout(() => {
      this.showModal = true;
      setTimeout(() => {
        this.flipped = true;
        setTimeout(() => {
          this.determineWinner();
          this.showResult = true;
        }, 600);
      }, 300);
    }, 300);
  }

  /** Annulé → reset */
  cancelChoice() {
    this.chosenCard = undefined;
    this.showConfirmation = false;
  }

  /** Compare et incrémente le score du tour */
  private determineWinner() {
    if (!this.chosenCard || !this.opponentCard) return;
    if (this.chosenCard.value > this.opponentCard.value) {
      this.userScore++;
      this.resultMessage = 'Tu as gagné ce tour ! 🎉';
    } else if (this.chosenCard.value < this.opponentCard.value) {
      this.opponentScore++;
      this.resultMessage = 'L’adversaire a gagné ce tour. 😢';
    } else {
      this.resultMessage = 'Égalité ce tour ! 🤝';
    }
  }

  /** Ferme la modal, gère fin de partie si deck vide ou maxRounds atteint */
  closeBattle() {
    this.showModal = false;
    this.flipped = false;
    this.showResult = false;

    // incrémente le round
    this.currentRound++;
    this.chosenCard = undefined;
    this.opponentCard = undefined;

    // fin de partie si un deck est vide ou tours épuisés
    if (
      this.cards.length === 0 ||
      this.opponentDeck.length === 0 ||
      this.currentRound > this.maxRounds
    ) {
      if (this.cards.length === 0) {
        this.resultMessage = 'Tu n\'as plus de cartes. Tu as perdu 😭';
      } else if (this.opponentDeck.length === 0) {
        this.resultMessage = 'L\'adversaire n\'a plus de cartes. Tu as gagné 🏆';
      } else if (this.userScore > this.opponentScore) {
        this.resultMessage = 'Bravo, tu remportes la partie ! 🏆';
      } else if (this.userScore < this.opponentScore) {
        this.resultMessage = 'Dommage, l’adversaire gagne la partie. 😭';
      } else {
        this.resultMessage = 'Match nul final. 🤝';
      }
      this.showResult = true;
    }
  }

  onDialogClick() {
    // pas d'action
  }
}
