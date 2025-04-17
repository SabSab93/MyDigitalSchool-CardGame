import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-cards.component.html'
})

export class ViewCardsComponent {
  message: string = 'Hello World';
}