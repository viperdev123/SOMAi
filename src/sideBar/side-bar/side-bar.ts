import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SocialMediaService } from '../../social-media-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../app/layouts/auth-layout/service/auth-service';
import { HistoryService } from '../../history/service/history-service';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { Inject, PLATFORM_ID } from '@angular/core';

interface SocialPlatformUI {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  connected: boolean;
  enabled: boolean;
}

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    MenubarModule,
    AvatarModule
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, OnDestroy {

  constructor(
    private socialService: SocialMediaService,
    private authService: AuthService,
    private router: Router,
    private HistoryService: HistoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  get isMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth <= 641;
    }
    return false;
  }

  items: MenuItem[] | undefined;
  isExpanded = true;
  currentUser: any = null;
  displaySocialDialog: boolean = false;
  private subscription: Subscription = new Subscription();
  visibleLogoutConfirm: boolean = false;
  accessToken: string | null = null;

  private platformConfigs = [
    { id: 'facebook', name: 'Facebook Page', icon: 'pi pi-facebook', bgColor: 'bg-blue-600', enabled: true },
    { id: 'instagram', name: 'Instagram Business', icon: 'pi pi-instagram', bgColor: 'bg-pink-600', enabled: true },
    { id: 'tiktok', name: 'TikTok', icon: 'pi pi-tiktok', bgColor: 'bg-gray-900', enabled: false },
    { id: 'x', name: 'X (Twitter)', icon: 'pi pi-twitter', bgColor: 'bg-gray-900', enabled: false }
  ];

  socialPlatforms: SocialPlatformUI[] = [];

  ngOnInit() {
    this.items = [
      { label: 'หน้าหลัก', icon: 'pi pi-home', routerLink: '/home' },
      { label: 'สร้าง Campaign', icon: 'pi pi-plus-circle', routerLink: '/create' },
      { label: 'รีวิว & แก้ไขดราฟ', icon: 'pi pi-pencil', routerLink: '/reviews' },
      { label: 'ประวัติ', icon: 'pi pi-history', routerLink: '/history' },
      { label: 'เกี่ยวกับเรา', icon: 'pi pi-info-circle', routerLink: '/about-us' }
    ];
    this.accessToken = this.authService.getAccessToken();
    if (this.accessToken) {
      this.items.push({
        label: 'ออกจากระบบ',
        icon: 'pi pi-power-off',
        command: (event) => {
          this.visibleLogoutConfirm = true;
        }
      });
    }
    this.currentUser = this.authService.getCurrentUser();
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
    if ((platform.id === 'facebook' || platform.id === 'instagram') && !platform.connected) {
      this.openFacebookPopup();
      return;
    }
    this.socialService.toggleConnection(platform.id);
  }


  logout() {
    this.authService.logout();
    this.HistoryService.clearCache();
    this.visibleLogoutConfirm = false;
  }

  goToLogin() {
    this.router.navigate(['/sign-in']);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  openFacebookPopup() {
    const accessToken = localStorage.getItem('accessToken');
    if (this.authService.isTokenExpired(accessToken)) {
      this.authService.refreshToken().subscribe({
        next: (res) => {
          if (!res.success || !res.data?.accessToken) {
            this.authService.logout();
            return;
          }
          this.authService.setAccessToken(res.data.accessToken);
          this.startFacebookConnect();
        },
        error: () => {
          this.authService.logout();
        }
      });
    } else {
      this.startFacebookConnect();
    }
  }


  private async startFacebookConnect() {
    try {
      await this.authService.connectFacebookPopup();
      this.socialService.setConnected('facebook', true);
      this.socialService.setConnected('instagram', true);
      window.location.reload();
    } catch (err) {
      console.error('Facebook connect failed:', err);
    }
  }

  openLogoutConfirm(event: MouseEvent) {
    event.stopPropagation();
    this.visibleLogoutConfirm = true;
  }

}