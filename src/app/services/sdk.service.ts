import { Injectable } from '@angular/core';

/**
 * Mock of mediawall's SdkService, which bridged share/camera/webview calls to a
 * native Android/iOS WebView host. There's no native host here, so each call
 * just logs what it would have sent across the bridge.
 */
@Injectable({ providedIn: 'root' })
export class SdkService {
  shareImage(description: string, imageUrl: string): void {
    console.log('[SdkService] shareImage', { type: 'share', desc: description, imageUrl });
  }

  openCamera(): void {
    console.log('[SdkService] openCamera');
  }

  openGallery(): void {
    console.log('[SdkService] openGallery');
  }
}
