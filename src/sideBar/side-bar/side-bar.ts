import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SocialMediaService } from '../../social-media-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../app/layouts/auth-layout/service/auth-service';
import { environment } from '../../environments/environment';

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
    ButtonModule
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, OnDestroy {

  constructor(
    private socialService: SocialMediaService,
    private authService: AuthService,
    private router: Router
  ) { }

  items: MenuItem[] | undefined;
  isExpanded = true;
  currentUser: any = null;
  displaySocialDialog: boolean = false;
  private subscription: Subscription = new Subscription();

  private platformConfigs = [
    { id: 'facebook', name: 'Facebook Page', icon: 'pi pi-facebook', bgColor: 'bg-blue-600', enabled: true },
    { id: 'instagram', name: 'Instagram Business', icon: 'pi pi-instagram', bgColor: 'bg-pink-600', enabled: false },
    { id: 'tiktok', name: 'TikTok', icon: 'pi pi-tiktok', bgColor: 'bg-gray-900', enabled: false },
    { id: 'x', name: 'X (Twitter)', icon: 'pi pi-twitter', bgColor: 'bg-gray-900', enabled: false }
  ];

  socialPlatforms: SocialPlatformUI[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Create Campaign', icon: 'pi pi-plus-circle', routerLink: '/create' },
      { label: 'My Campaigns', icon: 'pi pi-list', routerLink: '/campaigns' },
      { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' }
    ];

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

    if (platform.id === 'facebook' && !platform.connected) {
      this.openFacebookPopup();
      return;
    }
    this.socialService.toggleConnection(platform.id);
  }


  logout() {
    this.authService.logout();
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
    } catch (err) {
      console.error('Facebook connect failed:', err);
    }
  }



}