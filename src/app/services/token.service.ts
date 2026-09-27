import { Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import constants from '../constants/constants';
import { GetTokenDetailsResponse } from '../types/TokenType';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly tokenSubject = new BehaviorSubject<string>('');
  private readonly userIdSubject = new BehaviorSubject<string>('');

  /** Public RxJS Observable streams */
  readonly token$: Observable<string> = this.tokenSubject.asObservable();
  readonly userId$: Observable<string> = this.userIdSubject.asObservable();

  /** Modern Angular Signals */
  readonly tokenSignal = signal<string>('');
  readonly userIdSignal = signal<string>('');
  readonly userSignal = signal<GetTokenDetailsResponse | null>(null);

  /** Legacy / Public state properties maintained for backward compatibility */
  token = this.tokenSubject;
  userId = this.userIdSubject;
  url: string = '';
  user: GetTokenDetailsResponse | any = null;
  urlWithoutToken: string = constants.externalCallback;

  constructor(private readonly route: ActivatedRoute) {}

  /** Extract JWT token safely from URL query parameters */
  getJwtFromUrl(url?: string): string | null {
    try {
      const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
      if (!targetUrl.includes('?')) {
        return null;
      }
      const urlSearchParams = new URLSearchParams(targetUrl.split('?')[1]);
      return urlSearchParams.get('jwt');
    } catch (e) {
      console.error('Error parsing JWT from URL:', e);
      return null;
    }
  }

  getUrlWithToken(): string {
    return this.url;
  }

  setJwtToken(token: string): void {
    const value = token || '';
    this.tokenSubject.next(value);
    this.tokenSignal.set(value);
  }

  getJwtToken(): string {
    return this.tokenSubject.value;
  }

  getUrlWithoutToken(): string {
    return this.urlWithoutToken;
  }

  setUserDetails(user: GetTokenDetailsResponse | any): void {
    this.user = user;
    this.userSignal.set(user);
  }

  getUserDetails(): GetTokenDetailsResponse | any {
    return this.user;
  }

  setUserID(userId: string): void {
    const value = userId || '';
    this.userIdSubject.next(value);
    this.userIdSignal.set(value);
  }

  getUserID(): string {
    return this.userIdSubject.value;
  }
}

