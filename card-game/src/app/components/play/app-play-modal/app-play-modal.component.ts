import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-play-modal.component.html',
  styleUrls: ['./app-play-modal.component.scss']
})
export class AppPlayModalComponent {
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }
  onCloseClick() {
    this.close.emit();
  }
}
