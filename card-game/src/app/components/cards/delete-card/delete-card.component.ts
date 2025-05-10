import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';
import { DeleteModalComponent } from '../../../modal/delete-card-modal/delete-card-modal.component';

@Component({
  selector: 'app-delete-card',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  templateUrl: './delete-card.component.html',
  styleUrls: ['./delete-card.component.scss']
})
export class DeleteCardComponent implements OnInit {
  cards: CardModel[] = [];
  selectedCard: CardModel | null = null;
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
    this.isModalVisible = true;
  }

  onCancel() {
    this.isModalVisible = false;
    this.selectedCard = null;
  }

  onConfirmDelete() {
    if (!this.selectedCard) return;
    this.cardService.deleteCard(this.selectedCard).subscribe({
      next: () => {
        this.cards = this.cards.filter(c => c.id !== this.selectedCard!.id);
        this.onCancel();
      },
      error: err => console.error('Erreur suppression carte :', err)
    });
  }
}
