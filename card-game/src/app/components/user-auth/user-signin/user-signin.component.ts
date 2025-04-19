import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSignInService } from '../../../services/auth-services/user-signin.services';
import { Router } from '@angular/router';

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

  constructor(private signInService: UserSignInService, private router: Router) {}
  goBack() {
    this.router.navigate(['/']);
  }
  onSubmit(): void {
    this.errorMessage = null;

    this.signInService.signIn(this.login, this.password).subscribe({
      next: (token) => {
        console.log('Connexion réussie. Token :', token);
        this.router.navigate(['/home-card']);
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Erreur de connexion.';
      }
    });
  }
}
