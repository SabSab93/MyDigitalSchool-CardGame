import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent {
  @Output() close = new EventEmitter<void>();
  @ViewChild('modalContainer', { read: ViewContainerRef, static: false })
  modalContainer!: ViewContainerRef;;
}
