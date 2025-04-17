import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProfileModel } from '../types/profileModel-type';

@Injectable({
  providedIn: 'root'
})
export class UserSignUpService {
  private userSubject = new BehaviorSubject<ProfileModel | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {}

  signUp(newUser: ProfileModel) {
    console.log('New user signed up:', newUser);
    this.userSubject.next(newUser);
  }

  
}