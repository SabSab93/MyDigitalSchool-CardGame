import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  chosenCard?: CardModel;
  opponentCard?: CardModel;

  showConfirmation = false;
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
      if (deck) this.cards = [...deck.cards];
    });
  }

  /** 1) Choix initial => confirmation */
  chooseCard(c: CardModel) {
    if (this.chosenCard) return;
    this.chosenCard = c;
    this.showConfirmation = true;
  }

  /** 2) Oui => on lance le combat */
  confirmChoice() {
    this.showConfirmation = false;
    // prépare l'adversaire
    const pool = this.cards.filter(c => c !== this.chosenCard);
    this.opponentCard = pool[Math.floor(Math.random() * pool.length)];
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

  /** Non => reset */
  cancelChoice() {
    this.chosenCard = undefined;
    this.showConfirmation = false;
  }

  determineWinner() {
    if (!this.chosenCard || !this.opponentCard) return;
    if (this.chosenCard.value > this.opponentCard.value) {
      this.resultMessage = 'Tu as gagné ! 🎉';
    } else if (this.chosenCard.value < this.opponentCard.value) {
      this.resultMessage = 'Tu as perdu ! 😢';
    } else {
      this.resultMessage = 'Égalité ! 🤝';
    }
  }

  closeBattle() {
    this.showModal = false;
    this.flipped = false;
    this.showResult = false;
    this.resultMessage = '';
    this.chosenCard = undefined;
    this.opponentCard = undefined;
  }

  onDialogClick() {
    // pas d'action par défaut
  }
}
