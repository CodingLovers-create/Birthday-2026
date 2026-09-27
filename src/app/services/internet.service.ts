import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import constants from '../constants/constants';
import { WINDOW } from '../config/window.token';

@Injectable({
  providedIn: 'root'
})
export class InternetService {
  online = new BehaviorSubject<boolean>(true);
  showNoInternet = new BehaviorSubject<boolean>(false);

  constructor(@Inject(WINDOW) private readonly win: Window) {
    if (this.win && this.win.navigator) {
      this.online.next(this.win.navigator.onLine);
      this.win.addEventListener('online', () => this.updateOnlineStatus());
      this.win.addEventListener('offline', () => this.updateOnlineStatus());
    }
  }

  updateShowNoInternet() {
    this.showNoInternet.next(true);
    setTimeout(() => {
      this.showNoInternet.next(false);
    }, constants.ShowNoInternetTime);
  }

  private updateOnlineStatus() {
    if (this.win && this.win.navigator) {
      this.online.next(this.win.navigator.onLine);
    }
  }

  getOnlineStatus(): Observable<boolean> {
    return this.online.asObservable();
  }

  getOnlineStatusBooleanValue(): boolean {
    return this.online.getValue();
  }
}

