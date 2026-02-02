import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-page',
  imports: [
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.css',
})
export class CreatePage {

  selectedPlatforms: any[] = [];
  platforms = [
    { name: 'Facebook', code: 'FB', icon: 'pi pi-facebook', color: '#1877F2' },
    { name: 'Instagram', code: 'IG', icon: 'pi pi-instagram', color: '#E4405F' },
    { name: 'TikTok', code: 'TT', icon: 'pi pi-tiktok', color: '#000000' },
    { name: 'Twitter / X', code: 'TW', icon: 'pi pi-twitter', color: '#000000' }
  ];
}
