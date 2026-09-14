import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SortOption } from '../../../models/filter.model';

@Component({
  selector: 'app-sort-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-popup.component.html',
  styleUrl: './sort-popup.component.scss'
})
export class SortPopupComponent {
  readonly selected = input.required<SortOption>();
  readonly select = output<SortOption>();
  readonly close = output<void>();

  readonly options: { value: SortOption; label: string }[] = [
    { value: 'recent', label: 'Recent Activity' },
    { value: 'popular', label: 'Most Liked' }
  ];

  chooseOption(value: SortOption): void {
    this.select.emit(value);
    this.close.emit();
  }
}
