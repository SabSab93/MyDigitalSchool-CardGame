
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'home-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.scss']
})
export class HomeAuthComponent {
  constructor(private router: Router) {}
  goToSignUp() {
    this.router.navigate(['/signup']);
  }
  goToSignIn() {
    this.router.navigate(['/signin']);
  }
}