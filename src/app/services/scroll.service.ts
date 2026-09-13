import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  //Code written by Harshvardhan Pandey Ji
  private scrollPosition: number = 0;

  public disableScroll(): void {
    this.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
  }

  public enableScroll(): void {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, this.scrollPosition);
  }

  scrollToElement(elementId: string) {

    // Get the viewport height
    // var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView();
      }
    }, 100);
  }
}
