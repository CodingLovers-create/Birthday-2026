import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import constants from '../constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private route: ActivatedRoute) { }

  token = new BehaviorSubject<string>('')
  userId = new BehaviorSubject<string>('')
  url = '';
  user = '';
  urlWithoutToken = constants.externalCallback;

  getJwtFromUrl(url: string) {
    const currentUrl = window.location.href;
    const urlSearchParams = new URLSearchParams(currentUrl.split('?')[1]);
    let jwtToken = urlSearchParams.get('jwt');
    return jwtToken
  }

  getUrlWithToken() {
    return this.url;
  }

  setJwtToken(token: string) {
    this.token.next(token)
  }

  getJwtToken() {
    return this.token.value;
  }

  getUrlWithoutToken() {
    return this.urlWithoutToken;
  }

  setUserDetails(user: any) {
    this.user = user
  }

  getUserDetails() {
    return this.user;
  }

  setUserID(userId: string) {
    this.userId.next(userId)
  }

  getUserID() {
    return this.userId.value;
  }



}
