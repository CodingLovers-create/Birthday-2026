import { Injectable, signal, inject } from '@angular/core';
import { DataService } from './data.service';

export interface UserRegistrationData {
  username: string;
  state: string;
  constituency: string;
  mobile: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(DataService);

  readonly isLoggedInSignal = signal<boolean>(false);
  readonly registrationDraftSignal = signal<UserRegistrationData | null>(null);

  constructor() {
    // Restore session state on load if present
    const savedLoggedIn = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('isLoggedIn') === 'true' : false;
    const savedUser = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('username') : null;
    const savedState = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('state') : null;
    const savedConsti = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('constituency') : null;
    const savedMobile = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('mobile') : null;

    if (savedLoggedIn) {
      this.isLoggedInSignal.set(true);
      if (savedUser) this.dataService.setUsername(savedUser);
      if (savedState) this.dataService.setState(savedState);
      if (savedConsti) this.dataService.setConsti(savedConsti);
    }

    if (savedUser && savedState && savedConsti && savedMobile) {
      this.registrationDraftSignal.set({
        username: savedUser,
        state: savedState,
        constituency: savedConsti,
        mobile: savedMobile
      });
    }
  }

  saveDraftForm(data: UserRegistrationData): void {
    this.registrationDraftSignal.set(data);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('state', data.state);
      sessionStorage.setItem('constituency', data.constituency);
      sessionStorage.setItem('mobile', data.mobile);
    }
    this.dataService.setUsername(data.username);
    this.dataService.setState(data.state);
    this.dataService.setConsti(data.constituency);
  }

  getDraftForm(): UserRegistrationData | null {
    return this.registrationDraftSignal();
  }

  hasFormSubmitted(): boolean {
    const draft = this.registrationDraftSignal();
    return !!(draft && draft.username && draft.mobile);
  }

  verifyOtp(enteredOtp: string): boolean {
    const cleanOtp = (enteredOtp || '').trim();
    if (cleanOtp === '1234') {
      this.isLoggedInSignal.set(true);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('isLoggedIn', 'true');
        const draft = this.registrationDraftSignal();
        if (draft) {
          sessionStorage.setItem('username', draft.username);
          sessionStorage.setItem('state', draft.state);
          sessionStorage.setItem('constituency', draft.constituency);
          sessionStorage.setItem('userId', 'user_' + Date.now());
        }
      }
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSignal();
  }

  logout(): void {
    this.isLoggedInSignal.set(false);
    this.registrationDraftSignal.set(null);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('state');
      sessionStorage.removeItem('constituency');
      sessionStorage.removeItem('mobile');
    }
  }
}
