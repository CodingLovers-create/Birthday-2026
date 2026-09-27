import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WINDOW_TOKEN', {
  providedIn: 'root',
  factory: () => {
    const doc = inject(DOCUMENT);
    return doc.defaultView || (typeof window !== 'undefined' ? window : ({} as Window));
  }
});
