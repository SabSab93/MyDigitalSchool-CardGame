import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModel } from '../../../types/cardModel-type';
import { CardService } from '../../../services/card/card.service';
import { ShowCardComponent } from '../../../modal/show-card-modal/show-card-modal.component';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ShowCardComponent],
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent {
  name = '';
  value: number | null = null;

  selectedCard: CardModel | null = null;
  selectedDescription = '';

  constructor(private cardService: CardService) {}

  onSubmit(): void {
    if (!this.name || this.value === null) return;

    this.cardService.createCard({ name: this.name, value: this.value }).subscribe({
      next: (card) => {
        this.selectedCard = card;
        // placeholder description de 50 caractères
        this.selectedDescription = 
          "Une carte exceptionnelle imprégnée de magie ancienne.";
      },
      error: (err) => console.error('Erreur création carte :', err)
    });
  }
}
