import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface SocialPlatform {
  id: string;
  name: string;
  connected: boolean;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  private isBrowser: boolean;

  private openDialogSource = new Subject<void>();
  openDialog$ = this.openDialogSource.asObservable();

  private platformsSource = new BehaviorSubject<SocialPlatform[]>([]);
  platforms$ = this.platformsSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // โหลดข้อมูลหลังจากเช็คว่าเป็น browser แล้ว
    this.platformsSource.next(this.loadPlatforms());
  }

  triggerOpenDialog() {
    this.openDialogSource.next();
  }

  toggleConnection(platformId: string) {
    const currentPlatforms = this.platformsSource.getValue();
    const updatedPlatforms = currentPlatforms.map(p =>
      p.id === platformId ? { ...p, connected: !p.connected } : p
    );

    this.platformsSource.next(updatedPlatforms);
    this.saveToStorage(updatedPlatforms);
  }

  setConnected(platformId: string, value: boolean) {
    const currentPlatforms = this.platformsSource.getValue();
    const updatedPlatforms = currentPlatforms.map(p =>
      p.id === platformId ? { ...p, connected: value } : p
    );

    this.platformsSource.next(updatedPlatforms);
    this.saveToStorage(updatedPlatforms);
  }

  private loadPlatforms(): SocialPlatform[] {
    if (!this.isBrowser) {
      return this.getDefaultPlatforms();
    }

    const saved = localStorage.getItem('socialPlatforms');
    return saved ? JSON.parse(saved) : this.getDefaultPlatforms();
  }

  private saveToStorage(data: SocialPlatform[]) {
    if (this.isBrowser) {
      localStorage.setItem('socialPlatforms', JSON.stringify(data));
    }
  }

  private getDefaultPlatforms(): SocialPlatform[] {
    return [
      { id: 'facebook', name: 'Facebook', connected: false, enabled: true },
      { id: 'instagram', name: 'Instagram', connected: false, enabled: false },
      { id: 'tiktok', name: 'Tiktok', connected: false, enabled: false },
      { id: 'x', name: 'X (Twitter)', connected: false, enabled: false }
    ];
  }
}
