import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'; // เพิ่ม OnDestroy
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { LottieComponent } from 'ngx-lottie';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs'; // เพิ่ม Subscription

// ตรวจสอบ path ให้ถูกต้องตามโปรเจกต์จริง
import { CreatePageService } from '../service/create-page-service';
import { ReviewService } from '../../review/service/review-service';
import { SocialMediaService } from '../../social-media-service';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [
    InputTextModule,
    TextareaModule,
    ButtonModule,
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
export class CreatePage implements OnInit, OnDestroy { // Implement OnDestroy

  constructor(
    private messageService: MessageService,
    private createPageService: CreatePageService,
    private reviewStateService: ReviewService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private socialService: SocialMediaService
  ) { }

  createForm!: FormGroup;
  loading: boolean = false;
  progress: number = 0;
  private progressInterval: any;
  isAuthenticated: boolean = false;
  
  // ตัวจัดการ Subscription
  private subscription: Subscription = new Subscription();

  // 1. Config: เก็บข้อมูลหน้าตา (Static) *ไม่มี connected*
  // ** สำคัญ: id ต้องตรงกับ id ใน SocialMediaService **
  private platformConfigs = [
    { id: 'facebook', name: 'Facebook', code: 'FB', icon: 'pi pi-facebook', color: '#1877F2', bg: 'bg-blue-50' },
    { id: 'instagram', name: 'Instagram', code: 'IG', icon: 'pi pi-instagram', color: '#E4405F', bg: 'bg-pink-50' },
    { id: 'tiktok', name: 'Tiktok', code: 'TT', icon: 'pi pi-tiktok', color: '#000000', bg: 'bg-gray-50' },
    { id: 'x', name: 'X', code: 'TW', icon: 'pi pi-twitter', color: '#000000', bg: 'bg-gray-50' }
  ];

  // 2. Data: ตัวแปรที่จะใช้ Loop ใน HTML (รอรับค่าผสมจาก Service)
  platforms: any[] = [];

  lottieOptions = {
    path: 'assets/lottie/Robot-Bot.json',
    loop: true,
    autoplay: true
  };

  ngOnInit(): void {
    this.initCreateForm();

    // 3. Logic การดึงข้อมูลแบบ Real-time
    this.subscription.add(
      this.socialService.platforms$.subscribe(serviceData => {
        
        // เอา Config หน้าตา + สถานะจาก Service มารวมกัน
        this.platforms = this.platformConfigs.map(config => {
          const serviceItem = serviceData.find(s => s.id === config.id);
          return {
            ...config,
            connected: serviceItem ? serviceItem.connected : false
          };
        });

        // สั่งอัปเดตหน้าจอ
        this.cdr.markForCheck();
      })
    );
  }

  // 4. ล้าง Subscription เมื่อเปลี่ยนหน้า
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initCreateForm() {
    this.createForm = new FormGroup({
      productName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      targetGroup: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      platforms: new FormControl([], Validators.required),
      keyMessage: new FormControl('', [Validators.required, Validators.maxLength(500)])
    });
  }

  togglePlatform(platform: any) {
    // ถ้ายังไม่ Connect -> เปิด Dialog (Logic เดิม)
    if (!platform.connected) {
      this.socialService.triggerOpenDialog();
      return;
    }

    // ถ้า Connect แล้ว -> Select/Deselect
    const currentPlatforms = this.createForm.get('platforms')?.value || [];
    const index = currentPlatforms.findIndex((p: any) => p.code === platform.code);

    if (index > -1) {
      currentPlatforms.splice(index, 1);
    } else {
      currentPlatforms.push(platform);
    }

    this.createForm.patchValue({ platforms: currentPlatforms });
    this.createForm.get('platforms')?.markAsTouched();
  }

  isPlatformSelected(platform: any): boolean {
    const currentPlatforms = this.createForm.get('platforms')?.value || [];
    return currentPlatforms.some((p: any) => p.code === platform.code);
  }

  resetForm() {
    this.createForm.reset();
    this.createForm.patchValue({ platforms: [] });
  }

  submitForm() {
    if (this.createForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Incomplete', detail: 'Please fill in all required fields.' });
      this.createForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.startFakeProgress();

    const formValue = this.createForm.value;
    const { productName, targetGroup, keyMessage, platforms } = formValue;

    const user_brief = `
      Product: ${productName}
      Target: ${targetGroup}
      Key Message: ${keyMessage}
    `;

    const platformIds = platforms.map((p: any) => p.name);

    const payload = {
      user_brief,
      platformIds
    };

    this.createPageService.generateContentFromN8n(payload).subscribe({
      next: (res) => {
        this.reviewStateService.setData(res);
        this.completeProgress();
        console.log(res);
        setTimeout(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['/reviews']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.completeProgress();
        this.cdr.markForCheck();
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Something went wrong.'
        });
      }
    });
  }

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
    setTimeout(() => { this.progress = 0; }, 300);
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}