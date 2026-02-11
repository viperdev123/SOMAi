import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SocialMediaService } from '../../social-media-service';
import { Subscription } from 'rxjs';

interface SocialPlatformUI {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  connected: boolean;
}

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TooltipModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, OnDestroy {

  constructor(private socialService: SocialMediaService) { }

  items: MenuItem[] | undefined;
  isExpanded = true;
  currentUser: any = null;
  displaySocialDialog: boolean = false;
  private subscription: Subscription = new Subscription();

  // 1. Config สำหรับความสวยงาม (Fixed Data)
  private platformConfigs = [
    { id: 'facebook', name: 'Facebook Page', icon: 'pi pi-facebook', bgColor: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram Business', icon: 'pi pi-instagram', bgColor: 'bg-pink-600' },
    { id: 'tiktok', name: 'TikTok', icon: 'pi pi-tiktok', bgColor: 'bg-gray-900' },
    { id: 'x', name: 'X (Twitter)', icon: 'pi pi-twitter', bgColor: 'bg-gray-900' }
  ];

  // 2. ตัวแปรที่จะเอาไปวน Loop ใน HTML (Dynamic Data)
  socialPlatforms: SocialPlatformUI[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Create Campaign', icon: 'pi pi-plus-circle', routerLink: '/create' },
      { label: 'My Campaigns', icon: 'pi pi-list', routerLink: '/campaigns' },
      { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' }
    ];

    this.currentUser = {
      name: 'OhmlnwZazaHumyai007',
      email: 'apiwichpree@gmail.com',
      avatar: 'https://i.pravatar.cc/100'
    };

    // --- ส่วนการเชื่อมต่อ Service ---

    // A. รอฟังคำสั่งเปิด Dialog (จากหน้า Create หรือที่อื่น)
    this.subscription.add(
      this.socialService.openDialog$.subscribe(() => {
        this.displaySocialDialog = true;
      })
    );

    this.subscription.add(
      this.socialService.platforms$.subscribe((serviceData) => {
        this.socialPlatforms = this.platformConfigs.map(config => {
          const serviceItem = serviceData.find(d => d.id === config.id);
          return {
            ...config,
            connected: serviceItem ? serviceItem.connected : false
          };
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  openSocialDialog() {
    this.displaySocialDialog = true;
  }

  toggleConnection(platform: SocialPlatformUI) {
    this.socialService.toggleConnection(platform.id);
  }
}