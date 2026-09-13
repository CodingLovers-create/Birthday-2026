import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import constants from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class InternetService {

  constructor() { 
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  online = new BehaviorSubject<boolean>(navigator.onLine);
  showNoInternet = new BehaviorSubject<boolean>(false)

  updateShowNoInternet(){
    this.showNoInternet.next(true);
    setTimeout(()=>{
      this.showNoInternet.next(false);
    },constants.ShowNoInternetTime)
  }

  private updateOnlineStatus() {
    this.online.next(navigator.onLine);
  }

  getOnlineStatus(): Observable<boolean> {
    return this.online.asObservable();
  }

  getOnlineStatusBooleanValue(): boolean {
    return this.online.getValue();
  }
}
