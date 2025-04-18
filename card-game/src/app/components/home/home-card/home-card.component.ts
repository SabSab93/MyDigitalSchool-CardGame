import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ViewCardsComponent } from '../../cards/view-cards/view-cards.component';
import { AppModalComponent } from '../../../modal/app-modal/app-modal.component';
import { AppModalService } from '../../../services/modal/app-modal-service/app-modal.service';

interface Step {
  message: string;
  choices?: { label: string; action: string }[];
  action?: string;
}

@Component({
  selector: 'home-card',
  standalone: true,
  imports: [CommonModule, RouterModule, AppModalComponent],
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit, OnDestroy {
  @ViewChild(AppModalComponent, { static: true })
  modalComponent!: AppModalComponent;

  isModalVisible = false;

  steps: Step[] = [
    {
      message: 'Bienvenue dans le menu du jeu de bataille ! Que souhaitez‑vous faire ?',
      choices: [
        { label: 'Gestion des cartes', action: 'cards' },
        { label: 'Gestion des decks', action: 'decks' },
        { label: 'Jouer', action: 'play' }
      ]
    },
    {
      action: 'cards',
      message: 'Vous avez choisi la gestion des cartes. Sélectionnez une option ci-dessous.',
      choices: [
        { label: 'Visualiser la liste des cartes à disposition', action: 'viewCards' },
        { label: 'Visualiser le détail de chaque carte', action: 'viewCardDetails' },
        { label: 'Créer une nouvelle carte', action: 'createCard' },
        { label: 'Modifier une carte existante', action: 'editCard' },
        { label: 'Supprimer une carte', action: 'deleteCard' },
        { label: 'Retour', action: 'back' }
      ]
    },
    {
      action: 'decks',
      message: 'Vous avez choisi la gestion des decks. Sélectionnez une option ci-dessous.'
    }
  ];

  current: Step = this.steps[0];
  displayedText = '';
  private fullText = '';
  private charIndex = 0;
  private intervalId!: any;
  showChoices = false;
  private sound = new Audio('assets/audio/typewriter.mp3');
  private speed = 50;

  constructor(
    private router: Router,
    private modalService: AppModalService
  ) {}

  ngOnInit() {
    this.startTyping();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private startTyping() {
    this.fullText = this.current.message;
    this.displayedText = '';
    this.charIndex = 0;
    this.showChoices = false;
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.displayedText += this.fullText.charAt(this.charIndex);
        this.sound.currentTime = 0;
        this.sound.play().catch(() => {});
        this.charIndex++;
      } else {
        clearInterval(this.intervalId);
        this.showChoices = !!this.current.choices;
      }
    }, this.speed);
  }

  choose(choice: { label: string; action: string }) {
    // Retour
    if (choice.action === 'back') {
      this.current = this.steps[0];
      this.startTyping();
      return;
    }

    // Modal pour "viewCards"
    if (choice.action === 'viewCards') {
      this.openModal(ViewCardsComponent);
      return;
    }

    // … autres modals (viewCardDetails, createCard, etc.) …

    // Changement d’étape par défaut
    const next = this.steps.find(s => s.action === choice.action);
    if (next) {
      this.current = next;
      this.startTyping();
    }
  }

  private openModal(component: any) {
    this.isModalVisible = true;
    // on attend un tick pour que <app-modal> soit en DOM
    setTimeout(() => {
      const host: ViewContainerRef = this.modalComponent.modalContainer;
      host.clear();
      this.modalService.openModal(host, component);
    });
  }


  closeModal() {
    // 1) vider le conteneur
    this.modalComponent.modalContainer.clear();
    // 2) masquer le modal
    this.isModalVisible = false;

    // 3) réafficher le message + choix de l'étape courante
    this.displayedText = this.current.message;
    this.showChoices = true;
  }
}
