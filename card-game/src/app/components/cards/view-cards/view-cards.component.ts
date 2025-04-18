import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';


@Component({
  selector: 'app-view-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-cards.component.html'
})

export class ViewCardsComponent implements OnInit {
  cards: CardModel[] = [];
  currentIndex = 0;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getAllCards().subscribe({
      next: (data) => (this.cards = data),
      error: (err) => console.error('Erreur récupération cartes :', err)
    });
  }

  next() {
    if (this.cards.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    }
  }

  prev() {
    if (this.cards.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    }
  }
}