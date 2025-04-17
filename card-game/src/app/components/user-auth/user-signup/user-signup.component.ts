import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSignUpService } from '../../../services/auth-services/user-signup.services';
import { ProfileModel } from '../../../types/profileModel-type';
import { Router } from '@angular/router';


@Component({
  selector: 'user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignUpComponent {
  newUser: ProfileModel = {
    id: '',
    name: '',
    login: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private userInfoService: UserSignUpService, private router: Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.newUser.id = crypto.randomUUID(); 
    this.userInfoService.signUp(this.newUser).subscribe({
      next: (createdUser) => {
        console.log('Utilisateur créé :', createdUser);
        this.router.navigate(['/home-card']);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l’inscription. Veuillez réessayer.';
      }
    });
  }
}
