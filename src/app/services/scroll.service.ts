import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollPosition: number = 0;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  public disableScroll(): void {
    const win = this.document.defaultView;
    this.scrollPosition = win ? win.pageYOffset : 0;
    const body = this.document.body;
    if (body) {
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${this.scrollPosition}px`;
      body.style.width = '100%';
    }
  }

  public enableScroll(): void {
    const body = this.document.body;
    if (body) {
      body.style.removeProperty('overflow');
      body.style.removeProperty('position');
      body.style.removeProperty('top');
      body.style.removeProperty('width');
    }
    const win = this.document.defaultView;
    if (win) {
      win.scrollTo(0, this.scrollPosition);
    }
  }

  scrollToElement(elementId: string): void {
    setTimeout(() => {
      const element = this.document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}

