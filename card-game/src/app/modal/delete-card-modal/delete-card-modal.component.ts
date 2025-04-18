import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModel } from '../../types/cardModel-type';
import { ShowCardComponent } from '../show-card-modal/show-card-modal.component';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule,ShowCardComponent],
  templateUrl: './delete-card-modal.component.html',
  styleUrls: ['./delete-card-modal.component.scss']
})
export class DeleteModalComponent {
  @Input() card: CardModel | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
