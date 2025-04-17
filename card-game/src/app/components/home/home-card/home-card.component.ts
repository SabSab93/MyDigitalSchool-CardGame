import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Step {
  message: string;
  choices?: { label: string; action: string }[];
  action?: string;
}

@Component({
  selector: 'home-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    {
      message: 'Bienvenue dans le menu du jeu de bataille ! Que souhaitez‑vous faire ?',
      choices: [
        { label: 'Gestion des cartes', action: 'cards' },
        { label: 'Gestion des decks', action: 'decks' },
        { label: 'Jouer', action: 'play' }
      ]
    },
    {
      action: 'cards',
      message: 'Vous avez choisi la gestion des cartes. Sélectionnez une option ci‑dessous.',
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
      message: 'Vous avez choisi la gestion des decks. Sélectionnez une option ci‑dessous.'
    }
  ];
  current: Step = this.steps[0];

  // Pour l’effet “typewriter”
  displayedText = '';
  private fullText = '';
  private charIndex = 0;
  private intervalId!: any;
  showChoices = false;
  private sound = new Audio('assets/audio/typewriter.mp3');
  private speed = 50; // ms entre chaque caractère

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTyping();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private startTyping() {
    // Prépare
    this.fullText = this.current.message;
    this.displayedText = '';
    this.charIndex = 0;
    this.showChoices = false;
    clearInterval(this.intervalId);

    // Lance l’intervalle
    this.intervalId = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.displayedText += this.fullText.charAt(this.charIndex);
        // Lecture courte du son
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
    if (choice.action === 'play') {
      this.router.navigate(['/play']);
      return;
    }
  
    // Retour à l'étape précédente
    if (choice.action === 'back') {
      this.current = this.steps[0]; // Retour à la première étape (ou à l'étape précédente)
      this.startTyping();
      return;
    }
  
    // Change d’étape
    const next = this.steps.find(s => s.action === choice.action);
    if (next) {
      this.current = next;
      this.startTyping();
    }
  }
}