import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent  {
  @ViewChild('modalContainer', { read: ViewContainerRef, static: true }) modalContainer!: ViewContainerRef;
}