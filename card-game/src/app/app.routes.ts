// app.routes.ts
import { Routes } from '@angular/router';
import { UserSignUpComponent } from './components/user-auth/user-signup/user-signup.component';
import { UserSignInComponent } from './components/user-auth/user-signin/user-signin.component';

export const routes: Routes = [
  { path: 'register', component: UserSignUpComponent },
  { path: 'login', component: UserSignInComponent },
];