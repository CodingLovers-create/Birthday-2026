import { CommonModule } from '@angular/common';
import { Component, OnInit, input, output, signal } from '@angular/core';
import { FilterState } from '../../../models/filter.model';
import { TAGS } from '../../../mock/mock-data';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-filter-popup',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent implements OnInit {
  readonly filter = input.required<FilterState>();
  readonly apply = output<FilterState>();
  readonly close = output<void>();

  readonly tags = TAGS;
  readonly isExitConfirmOpen = signal(false);

  selectedTag: string | null = null;

  ngOnInit(): void {
    this.selectedTag = this.filter().tag;
  }

  get hasChanges(): boolean {
    return this.selectedTag !== this.filter().tag;
  }

  pickTag(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? null : tag;
  }

  clearTag(): void {
    this.selectedTag = null;
  }

  requestClose(): void {
    if (this.hasChanges) {
      this.isExitConfirmOpen.set(true);
    } else {
      this.close.emit();
    }
  }

  discardAndClose(): void {
    this.isExitConfirmOpen.set(false);
    this.close.emit();
  }

  applyFilter(): void {
    this.apply.emit({ ...this.filter(), tag: this.selectedTag });
    this.close.emit();
  }
}
