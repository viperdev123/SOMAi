import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  items: MenuItem[] | undefined;
  isExpanded = true;

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Create Campaign', icon: 'pi pi-plus-circle', routerLink: '/create' },
      { label: 'My Campaigns', icon: 'pi pi-list', routerLink: '/campaigns' },
      { label: 'S ettings', icon: 'pi pi-cog', routerLink: '/settings' }
    ];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}