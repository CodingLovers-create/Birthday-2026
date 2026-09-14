import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SdkService } from '../../services/sdk.service';

import { PageHeaderComponent } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'app-seva-ki-kahani',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './seva-ki-kahani.component.html',
  styleUrls: ['./seva-ki-kahani.component.scss']
})
export class SevaKiKahaniComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private sdkService: SdkService,
    private dataService: DataService
  ) {}

  goBack(): void {
    this.router.navigate(['/main']);
  }

  onUploadClick(): void {
    console.log('[SevaKiKahaniComponent] User clicked Upload button');
    this.sdkService.openGallery();
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.removeAttribute('capture');
      this.fileInput.nativeElement.click();
    } else {
      this.router.navigate(['/create-post'], { queryParams: { tag: 'Seva Ki Kahani', action: 'gallery' } });
    }
  }

  onCaptureClick(): void {
    console.log('[SevaKiKahaniComponent] User clicked Capture button');
    this.sdkService.openCamera();
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.setAttribute('capture', 'environment');
      this.fileInput.nativeElement.click();
    } else {
      this.router.navigate(['/create-post'], { queryParams: { tag: 'Seva Ki Kahani', action: 'camera' } });
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const rawBase64 = e.target?.result as string;
        if (rawBase64) {
          this.dataService.apiResponseImage.next(rawBase64);
          this.router.navigate(['/create-post'], { queryParams: { tag: 'Seva Ki Kahani' } });
        }
      };
      reader.readAsDataURL(file);
      target.value = '';
    } else {
      this.router.navigate(['/create-post'], { queryParams: { tag: 'Seva Ki Kahani' } });
    }
  }
}
