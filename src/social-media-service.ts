import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SocialPlatform {
  id: string;      // key หลักสำหรับเช็ค (เช่น 'facebook')
  name: string;
  connected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  private openDialogSource = new Subject<void>();
  openDialog$ = this.openDialogSource.asObservable();

  private platformsSource = new BehaviorSubject<SocialPlatform[]>([
    { id: 'facebook', name: 'Facebook', connected: true },
    { id: 'instagram', name: 'Instagram', connected: false },
    { id: 'tiktok', name: 'Tiktok', connected: false },
    { id: 'x', name: 'X (Twitter)', connected: true }
  ]);
  
  platforms$ = this.platformsSource.asObservable();

  constructor() { }

  triggerOpenDialog() {
    this.openDialogSource.next();
  }

  toggleConnection(platformId: string) {
    const currentPlatforms = this.platformsSource.getValue();
    const updatedPlatforms = currentPlatforms.map(p => {
      if (p.id === platformId) {
        return { ...p, connected: !p.connected };
      }
      return p;
    });

    this.platformsSource.next(updatedPlatforms);
    console.log(`Updated ${platformId} status`);
  }
}