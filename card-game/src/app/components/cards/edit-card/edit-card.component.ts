import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit {
  cards: CardModel[] = [];
  selectedCard: CardModel | null = null;
  selectedDescription = '';
  isCardUpdated = false;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getAllCards().subscribe({
      next: cards => this.cards = cards,
      error: err => console.error('Erreur récupération cartes :', err)
    });
  }

  selectCard(card: CardModel) {

    this.selectedCard = { ...card };
    // placeholder description (remplacera par backend plus tard)
    this.selectedDescription = "Description temporaire de la carte.";
    this.isCardUpdated = false;
  }

  onSubmit() {
    if (!this.selectedCard) return;
    this.cardService.updateCard(this.selectedCard).subscribe({
      next: updated => {
        // met à jour la liste locale
        const idx = this.cards.findIndex(c => c.id === updated.id);
        if (idx > -1) this.cards[idx] = updated;
        this.selectedCard = updated;
        this.isCardUpdated = true;
        // tu peux afficher un toast ou message de succès ici
      },
      error: err => console.error('Erreur mise à jour carte :', err)
    });
  }
}
