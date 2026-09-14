import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  host: {
    class: 'block w-full shrink-0 z-20'
  }
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly back = output<void>();
  readonly showBack = input<boolean>(true);
}
