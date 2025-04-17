import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfilComponent } from './components/user-auth/user-signup/user-signup.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserSignUpService } from './services/user-signup.services';
import { ProfileModel } from './types/profileModel-type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserProfilComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'project-angular';
  private userSubscription!: Subscription;

  constructor(private userService: UserSignUpService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe((user: ProfileModel | null) => {
      if (user) {
        console.log('Utilisateur connecté :', user);
        // redirection vers home
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
