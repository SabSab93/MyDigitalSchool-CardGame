import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Type,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewCardsComponent } from '../../cards/view-cards/view-cards.component';
import { AppModalComponent } from '../../../modal/app-modal/app-modal.component';
import { AppModalService } from '../../../services/modal/app-modal-service/app-modal.service';
import { CreateCardComponent } from '../../cards/create-card/create-card.component';
import { EditCardComponent } from '../../cards/edit-card/edit-card.component';
import { DeleteCardComponent } from '../../cards/delete-card/delete-card.component';
import { ViewDeckComponent } from '../../decks/view-decks/view-decks.component';
import { CreateDeckComponent } from '../../decks/create-deck/create-deck.component';
import { DeleteDeckComponent } from '../../decks/delete-deck/delete-deck.component';
import { EditDeckComponent } from '../../decks/edit-deck/edit-deck.component';
import { PlayDeckSelectionComponent } from '../../play/play-deck-selection/play-deck-selection.component';
import { DeckWithCardsModel } from '../../../types/deckModel-type';

interface Step {
  speaker?: string;
  message: string;
  choices?: { label: string; action: string }[];
  action?: string;
}

@Component({
  selector: 'home-card',
  standalone: true,
  imports: [CommonModule, RouterModule, AppModalComponent],
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  host: {
    '[class.modal-open]': 'isModalVisible'
  }
})
export class HomeCardComponent implements OnInit, OnDestroy {
  @ViewChild(AppModalComponent)
  modalComponent!: AppModalComponent;

  isModalVisible = false;
  componentToLoad: Type<any> | null = null;

  steps: Step[] = [
    {
      speaker: 'Menu principal',
      message: 'Bienvenue dans le menu du jeu de bataille ! Que souhaitez-vous faire ?',
      choices: [
        { label: 'Gestion des cartes', action: 'cards' },
        { label: 'Gestion des decks', action: 'decks' },
        { label: 'Jouer', action: 'play' }
      ]
    },
    {
      speaker: 'Cartes',
      action: 'cards',
      message: 'Vous avez choisi la gestion des cartes. Sélectionnez une option ci-dessous.',
      choices: [
        { label: 'Visualiser la liste des cartes à disposition', action: 'viewCards' },
        { label: 'Créer une nouvelle carte', action: 'createCard' },
        { label: 'Modifier une carte existante', action: 'editCard' },
        { label: 'Supprimer une carte', action: 'deleteCard' },
        { label: 'Retour', action: 'back' }
      ]
    },
    {
      speaker: 'Decks',
      action: 'decks',
      message: 'Vous avez choisi la gestion des decks. Sélectionnez une option ci-dessous.',
      choices: [
        { label: 'Visualiser la liste des decks à disposition', action: 'viewDecks' },
        { label: 'Créer un nouveau deck', action: 'createDeck' },
        { label: 'Modifier un deck existant', action: 'editDeck' },
        { label: 'Supprimer un deck', action: 'deleteDeck' },
        { label: 'Retour', action: 'back' }
      ]
    }
  ];

  isTyping = false;
  current: Step = this.steps[0];
  displayedText = '';
  private fullText = '';
  private charIndex = 0;
  private intervalId!: any;
  showChoices = false;

  // Son et vitesse
  private sound!: HTMLAudioElement;
  private speed = 50;

  constructor(private modalService: AppModalService) {}

  ngOnInit() {
    this.startTyping();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.stopSound();
  }

  private startTyping() {
    this.fullText = this.current.message;
    this.displayedText = '';
    this.charIndex = 0;
    this.showChoices = false;
    this.isTyping = true;
    clearInterval(this.intervalId);

    // Lance la boucle sonore
    this.sound = new Audio('assets/audio/typewriter.mp3');
    this.sound.loop = true;
    this.sound.currentTime = 0;
    this.sound.play().catch(() => { /* silent */ });

    this.intervalId = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.displayedText += this.fullText.charAt(this.charIndex++);
      } else {
        clearInterval(this.intervalId);
        this.isTyping = false;
        this.showChoices = !!this.current.choices;
        this.stopSound();
      }
    }, this.speed);
  }

  choose(choice: { label: string; action: string }) {
    if (choice.action === 'back') {
      this.current = this.steps[0];
      this.startTyping();
      return;
    }
    if (choice.action === 'viewCards') { this.openModal(ViewCardsComponent); return; }
    if (choice.action === 'createCard') { this.openModal(CreateCardComponent); return; }
    if (choice.action === 'editCard')   { this.openModal(EditCardComponent); return; }
    if (choice.action === 'deleteCard') { this.openModal(DeleteCardComponent); return; }
    if (choice.action === 'viewDecks')  { this.openModal(ViewDeckComponent); return; }
    if (choice.action === 'createDeck') { this.openModal(CreateDeckComponent); return; }
    if (choice.action === 'deleteDeck') { this.openModal(DeleteDeckComponent); return; }
    if (choice.action === 'editDeck')   { this.openModal(EditDeckComponent); return; }
    if (choice.action === 'play')       {this.openModal(PlayDeckSelectionComponent);return;}

    const next = this.steps.find(s => s.action === choice.action);
    if (next) {
      this.current = next;
      this.startTyping();
    }
  }

  openModal(component: Type<any>) {
    this.componentToLoad = component;
    this.isModalVisible = true;
    setTimeout(() => {
      if (this.modalComponent?.modalContainer) {
        const host: ViewContainerRef = this.modalComponent.modalContainer;
        host.clear();
        this.modalService.openModal(host, component);
      }
    });
  }

  closeModal() {
    if (this.modalComponent?.modalContainer) {
      this.modalComponent.modalContainer.clear();
    }
    this.isModalVisible = false;
    this.componentToLoad = null;
    this.displayedText = this.current.message;
    this.showChoices = true;
  }

  @HostListener('document:click', ['$event'])
  onAnywhereClick(event: MouseEvent) {
    this.onTextClick();
  }

  onTextClick() {
    if (this.isTyping) {
      clearInterval(this.intervalId);
      this.displayedText = this.fullText;
      this.isTyping = false;
      this.showChoices = !!this.current.choices;
      this.stopSound();
    }
  }

  /** Arrête et remet le son au début */
  private stopSound() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }
  startGame(deck: DeckWithCardsModel) {
    this.closeModal();
  }
}
