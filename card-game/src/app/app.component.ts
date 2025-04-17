import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-angular';
  isMuted = false;

  private audio = new Audio('assets/audio/background.mp3');
  private hasUserInteracted = false;

  constructor(private faIconLibrary: FaIconLibrary) {
    this.faIconLibrary.addIcons(faVolumeUp, faVolumeMute);
    this.audio.loop = true;
    this.audio.volume = 0.5;

    // Vérifie si le format est supporté
    console.log('Can play MP3?', this.audio.canPlayType('audio/mpeg')); // doit renvoyer 'probably' ou 'maybe'
  }

  toggleSound(): void {
    this.isMuted = !this.isMuted;
    this.isMuted ? this.audio.pause() : this.audio.play();
  }

  // Démarre la musique après une première interaction utilisateur
  @HostListener('document:click', ['$event'])
  onUserInteraction(): void {
    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true;
      if (!this.isMuted && this.audio.paused) {
        this.audio.play().catch(err => console.warn('Lecture audio bloquée :', err));
      }
    }
  }
}
