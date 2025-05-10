import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';
import { ShowCardComponent } from '../../../modal/show-card-modal/show-card-modal.component';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ShowCardComponent
  ],
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit {
  cards: CardModel[] = [];
  selectedCard: CardModel | null = null;
  selectedDescription = '';
  isCardUpdated = false;
  isModalVisible = false;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getAllCards().subscribe({
      next: cards => this.cards = cards,
      error: err => console.error('Erreur récupération cartes :', err)
    });
  }

  selectCard(card: CardModel) {
    this.selectedCard = { ...card };
    this.selectedDescription = "Description temporaire de la carte.";
    this.isCardUpdated = false;
    this.closeModal();
  }

  onSubmit() {
    if (!this.selectedCard) return;

    const val = this.selectedCard.value;
    // validation TS
    if (val === null || val === undefined || val < 0 || val > 20) {
      console.warn(`Valeur invalide (${val}), doit être entre 0 et 20.`);
      return;
    }

    this.cardService.updateCard(this.selectedCard).subscribe({
      next: updated => {
        const idx = this.cards.findIndex(c => c.id === updated.id);
        if (idx > -1) this.cards[idx] = updated;
        this.selectedCard = updated;
        this.isCardUpdated = true;
        this.openModal();
      },
      error: err => console.error('Erreur mise à jour carte :', err)
    });
  }

  openModal() { this.isModalVisible = true; }
  closeModal() { this.isModalVisible = false; }
  cancelEdit() {
    if (this.selectedCard) {
      const original = this.cards.find(c => c.id === this.selectedCard!.id);
      if (original) this.selectedCard = { ...original };
    }
    this.isCardUpdated = false;
    this.closeModal();
  }
}
