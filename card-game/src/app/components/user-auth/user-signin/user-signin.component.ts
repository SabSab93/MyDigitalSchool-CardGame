import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSignInService } from '../../../services/user-signin.services';

@Component({
  selector: 'user-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.scss']
})
export class UserSignInComponent {
  login: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private signInService: UserSignInService) {}

  onSubmit(): void {
    this.errorMessage = null;

    this.signInService.signIn(this.login, this.password).subscribe({
      next: (token) => {
        console.log('Connexion réussie. Token :', token);
        // redirection ou autre logique après login
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Erreur de connexion.';
      }
    });
  }
}
