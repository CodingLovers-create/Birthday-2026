import { Directive, ElementRef, HostListener } from '@angular/core';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

@Directive({
  selector: '[appPinchZoom]',
  standalone: true
})
export class PinchZoomDirective {
  private readonly activePointers = new Map<number, PointerEvent>();
  private startDistance = 0;
  private startScale = MIN_SCALE;
  private scale = MIN_SCALE;

  constructor(private readonly el: ElementRef<HTMLElement>) {
    this.el.nativeElement.style.touchAction = 'pan-y';
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.activePointers.set(event.pointerId, event);
    if (this.activePointers.size === 2) {
      this.startDistance = this.distanceBetweenPointers();
      this.startScale = this.scale;
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.activePointers.has(event.pointerId)) {
      return;
    }
    this.activePointers.set(event.pointerId, event);

    if (this.activePointers.size === 2 && this.startDistance > 0) {
      const distance = this.distanceBetweenPointers();
      const nextScale = (distance / this.startDistance) * this.startScale;
      this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
      this.el.nativeElement.style.transform = `scale(${this.scale})`;
    }
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  @HostListener('pointerleave', ['$event'])
  onPointerEnd(event: PointerEvent): void {
    this.activePointers.delete(event.pointerId);
    if (this.activePointers.size < 2) {
      this.startDistance = 0;
      if (this.activePointers.size === 0 && this.scale <= MIN_SCALE) {
        this.reset();
      }
    }
  }

  @HostListener('dblclick')
  onDoubleClick(): void {
    this.reset();
  }

  private distanceBetweenPointers(): number {
    const pointers = Array.from(this.activePointers.values());
    if (pointers.length < 2 || !pointers[0] || !pointers[1]) {
      return 0;
    }
    return Math.hypot(pointers[0].clientX - pointers[1].clientX, pointers[0].clientY - pointers[1].clientY);
  }

  private reset(): void {
    this.scale = MIN_SCALE;
    this.el.nativeElement.style.transform = 'scale(1)';
  }
}
