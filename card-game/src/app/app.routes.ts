import { Routes } from '@angular/router';
import { UserSignUpComponent } from './components/user-auth/user-signup/user-signup.component';
import { UserSignInComponent } from './components/user-auth/user-signin/user-signin.component';
import { HomeAuthComponent } from './components/home/home-auth/home-auth.component';
import { HomeCardComponent } from './components/home/home-card/home-card.component';
import { AuthGuard } from './services/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeAuthComponent },
  { path: 'signup', component: UserSignUpComponent },
  { path: 'signin', component: UserSignInComponent },
  { path: 'home-card', component: HomeCardComponent, canActivate: [AuthGuard] },
];