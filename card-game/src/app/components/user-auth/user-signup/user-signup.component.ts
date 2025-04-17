import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSignUpService } from '../../../services/user-signup.services';
import { ProfileModel } from '../../../types/profileModel-type';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserProfilComponent {
  newUser: ProfileModel = {
    id: '',
    name: '',
    login: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private userInfoService: UserSignUpService) {}

  onSubmit() {
    this.errorMessage = null;
    this.newUser.id = crypto.randomUUID(); 
    this.userInfoService.signUp(this.newUser).subscribe({
      next: (createdUser) => {
        console.log('Utilisateur créé :', createdUser);
        //Redirection vers home
      },
      error: (err) => {
        if (err.error?.message === 'pseudo existant') {
          this.errorMessage = 'Ce pseudo est déjà utilisé. Veuillez en choisir un autre.';
        } else {
          this.errorMessage = 'Erreur lors de l’inscription. Veuillez réessayer.';
        }
      }
    });
  }
}
