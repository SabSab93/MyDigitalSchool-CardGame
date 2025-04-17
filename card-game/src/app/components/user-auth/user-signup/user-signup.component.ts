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

constructor(private userInfoService: UserSignUpService) {}
onSubmit() {
    this.newUser.id = crypto.randomUUID(); // ou autre générateur d'ID
    this.userInfoService.signUp(this.newUser);
  }
}
