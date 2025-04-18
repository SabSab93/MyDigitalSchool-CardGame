import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModel } from '../../types/cardModel-type';

@Component({
  selector: 'app-show-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-card-modal.component.html',
  styleUrls: ['./show-card-modal.component.scss']
})
export class ShowCardComponent {
  @Input() selectedCard: CardModel | null = null;
  @Input() selectedDescription: string = '';
}