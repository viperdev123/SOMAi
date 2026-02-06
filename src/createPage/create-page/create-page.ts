import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CreatePageService } from '../service/create-page-service';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-create-page',
  imports: [
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    DialogModule,
    ProgressBarModule,
    LottieComponent
  ],
  providers: [MessageService],
  templateUrl: './create-page.html',
  styleUrl: './create-page.css',
})
export class CreatePage implements OnInit {

  constructor(
    private messageService: MessageService,
    private createPageService: CreatePageService,
    private cdr: ChangeDetectorRef
  ) { }

  createForm!: FormGroup;
  selectedPlatforms: any[] = [];
  loading: boolean = false;
  progress: number = 0;
  private progressInterval: any;


  ngOnInit(): void {
    this.initCreateForm();

  }

  initCreateForm() {
    this.createForm = new FormGroup({
      productName: new FormControl('', [Validators.required, Validators.maxLength(50)
      ]),
      targetGroup: new FormControl('', [Validators.required, Validators.maxLength(50)
      ]),
      platforms: new FormControl([], Validators.required),
      keyMessage: new FormControl('', [Validators.required, Validators.maxLength(150)
      ])
    });
  }


  submitForm() {
    if (this.createForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      this.createForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.startFakeProgress();

    const { productName, targetGroup, keyMessage, platforms } = this.createForm.value;
    const user_brief = `
  ทำหน้าที่เป็นนักการตลาดมืออาชีพ ...
  - ชื่อสินค้า: ${productName}
  - กลุ่มเป้าหมาย: ${targetGroup}
  - จุดเด่น: ${keyMessage}
  `;

    const platformIds = platforms.map((p: any) => p.name);
    const payload = {
      user_brief,
      platformIds,
      temp: 'https://60br94kh-5000.asse.devtunnels.ms/api/test_gen_content'
    };

    this.createPageService.generateContentFromN8n(payload).subscribe({
      next: (res) => {
        this.completeProgress();
        console.log(res);
        setTimeout(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.completeProgress();
        this.cdr.markForCheck();
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
        });
      }
    });

  }

  platforms = [
    { name: 'Facebook', code: 'FB', icon: 'pi pi-facebook', color: '#1877F2' },
    { name: 'Instagram', code: 'IG', icon: 'pi pi-instagram', color: '#E4405F' },
    { name: 'Tiktok', code: 'TT', icon: 'pi pi-tiktok', color: '#000000' },
    { name: 'X', code: 'TW', icon: 'pi pi-twitter', color: '#000000' }
  ];

  startFakeProgress() {
    this.progress = 5;

    this.progressInterval = setInterval(() => {
      if (this.progress < 70) {
        this.progress += Math.random() * 4;
      } else if (this.progress < 90) {
        this.progress += Math.random() * 0.5;
      }

      if (this.progress > 90) {
        this.progress = 90;
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  completeProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.progress = 100;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.progress = 0;
    }, 300);
  }

  lottieOptions = {
    path: 'assets/lottie/Robot-Bot.json',
    loop: true,
    autoplay: true
  };



}
