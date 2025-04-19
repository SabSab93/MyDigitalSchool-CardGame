import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShowDeckModalComponent } from '../show-deck-modal/show-deck-modal.component';
import { DeckModel } from '../../types/deckModel-type';

@Component({
  selector: 'app-delete-deck-modal',
  standalone: true,
  imports: [CommonModule,ShowDeckModalComponent],
  templateUrl: './delete-deck-modal.component.html',
  styleUrls: ['./delete-deck-modal.component.scss']
})
export class DeleteDeckModalComponent {
  @Input() card: DeckModel | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
