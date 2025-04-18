import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';
import { ShowCardComponent } from '../../../modal/show-card-modal/show-card.component';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ShowCardComponent],
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
      error: err => console.error('Erreur récupération cartes :', err)
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
    this.cardService.updateCard(this.selectedCard).subscribe({
      next: updated => {
        const idx = this.cards.findIndex(c => c.id === updated.id);
        if (idx > -1) this.cards[idx] = updated;
        this.selectedCard = updated;
        this.isCardUpdated = true;
        this.openModal();    // <-- ouvre le modal
      },
      error: err => console.error(err)
    });
  }

  openModal() { this.isModalVisible = true; }
  closeModal() { this.isModalVisible = false; }
}
