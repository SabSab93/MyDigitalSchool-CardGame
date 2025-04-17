import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { UserSignUpComponent } from './components/user-auth/user-signup/user-signup.component';
import { UserSignInComponent } from './components/user-auth/user-signin/user-signin.component';

import { UserSignUpService } from './services/user-signup.services';
import { UserSignInService } from './services/user-signin.services';
import { ProfileModel } from './types/profileModel-type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
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
        // redirection vers home si besoin
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
