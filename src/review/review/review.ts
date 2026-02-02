import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CarouselModule } from 'primeng/carousel';

interface ImageItem {
  id: string;
  itemImageSrc: SafeUrl;
  thumbnailImageSrc: SafeUrl;
  _blobUrl: string;
  file: File;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TextareaModule,
    FormsModule,
    Dialog,
    Toast,
    Ripple,
    CommonModule,
    TooltipModule,
    GalleriaModule,
    CarouselModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './review.html',
  styleUrl: './review.css',
})

export class Review implements OnDestroy, OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('igFileInput') igFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tiktokFileInput') tiktokFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('twitterFileInput') twitterFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  text: string = '☕ Start your morning right with our Premium Coffee Blend! ✨Crafted for the discerning professional who values quality and sustainability. Every sip tells astory of ethical sourcing and expert roasting.#CoffeeLovers #MorningRitual #PremiumCoffee';
  text2: string = 'Your daily dose of perfection ☕✨Ethically sourced. Expertly roasted. Perfectly crafted for professionals who demand excellence.Tap to discover your new morning ritual 👆#PremiumCoffee #CoffeeCulture #MorningVibes #Lifestyle';
  text3: string = 'POV: You just discovered the perfect coffee ☕✨This isn\'t just coffee - it\'s a whole vibe 🔥Ethically sourced beans that actually taste PREMIUM 💯Young professionals get it 🎯#CoffeeTok #MorningRoutine #PremiumCoffee #ProductivityHacks';
  twitterText: string = "Just tried this new cafe! ☕️ The atmosphere is amazing and the coffee is top tier. 🚀 \n\nHighly recommended! #CoffeeLover #CafeVibes";
  uploadedImages: ImageItem[] = [];
  visible: boolean = false;
  displayGallery: boolean = false;
  activeIndex: number = 0;
  igImages: ImageItem[] = [];
  tiktokImages: ImageItem[] = [];
  twitterImages: ImageItem[] = [];
  visibleEditCaption = false;

  facebookForm!: FormGroup;
  instagramForm!: FormGroup;
  tiktokForm!: FormGroup;
  twitterForm!: FormGroup;

  currentPlatform!: 'facebook' | 'instagram' | 'tiktok' | 'twitter';

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.facebookForm = new FormGroup({
      postText: new FormControl(this.text, [Validators.required, Validators.maxLength(5000)])
    });

    this.instagramForm = new FormGroup({
      postText: new FormControl(this.text2, [Validators.required, Validators.maxLength(2200)])
    });

    this.tiktokForm = new FormGroup({
      postText: new FormControl(this.text3, [Validators.required, Validators.maxLength(2200)])
    });

    this.twitterForm = new FormGroup({
      postText: new FormControl(this.twitterText, [Validators.required, Validators.maxLength(280)])
    });
  }

  showDialog() {
    this.visible = true;
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'โพสต์สำเร็จแล้ว' });
    this.visible = false;
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'โพสต์ไม่สำเร็จ' });
    this.visible = false;
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'อัปโหลดไม่สำเร็จ',
        detail: 'อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น'
      });
      event.target.value = '';
      return;
    }
    const newImages = fileArray.map(file => {
      const blobUrl = URL.createObjectURL(file);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      return {
        id: crypto.randomUUID(),
        itemImageSrc: safeUrl,
        thumbnailImageSrc: safeUrl,
        _blobUrl: blobUrl,
        file: file
      };
    });
    this.uploadedImages = [...this.uploadedImages, ...newImages];
    this.cdr.detectChanges();
    event.target.value = '';
  }


  onIgFileSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));

    if (invalidFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'อัปโหลดไม่สำเร็จ',
        detail: 'Instagram อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น'
      });
      event.target.value = '';
      return;
    }

    const newImages = fileArray.map(file => {
      const blobUrl = URL.createObjectURL(file);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      return {
        id: crypto.randomUUID(),
        itemImageSrc: safeUrl,
        thumbnailImageSrc: safeUrl,
        _blobUrl: blobUrl,
        file
      };
    });

    this.igImages = [...this.igImages, ...newImages];
    this.cdr.detectChanges();
    event.target.value = '';
  }


  onTikTokFileSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));

    if (invalidFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'อัปโหลดไม่สำเร็จ',
        detail: 'อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น'
      });
      event.target.value = '';
      return;
    }

    const newImages = fileArray.map(file => {
      const blobUrl = URL.createObjectURL(file);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      return {
        id: crypto.randomUUID(),
        itemImageSrc: safeUrl,
        thumbnailImageSrc: safeUrl,
        _blobUrl: blobUrl,
        file
      };
    });

    this.tiktokImages = [...this.tiktokImages, ...newImages];
    this.cdr.detectChanges();
    event.target.value = '';
  }


  onTwitterFileSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'อัปโหลดไม่สำเร็จ',
        detail: 'อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น'
      });
      event.target.value = '';
      return;
    }

    const currentCount = this.twitterImages.length;
    const remainingSlots = 4 - currentCount;

    if (remainingSlots <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ครบจำนวนแล้ว',
        detail: 'X (Twitter) อัปโหลดได้สูงสุด 4 รูปต่อโพสต์'
      });
      event.target.value = '';
      return;
    }

    if (fileArray.length > remainingSlots) {
      this.messageService.add({
        severity: 'info',
        summary: 'รูปเกินกำหนด',
        detail: `ระบบจะเลือกให้เฉพาะ 4 รูปแรกเท่านั้น`
      });
    }

    const newImages = fileArray
      .slice(0, remainingSlots)
      .map(file => {
        const blobUrl = URL.createObjectURL(file);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        return {
          id: crypto.randomUUID(),
          itemImageSrc: safeUrl,
          thumbnailImageSrc: safeUrl,
          _blobUrl: blobUrl,
          file
        };
      });

    this.twitterImages = [...this.twitterImages, ...newImages];
    this.cdr.detectChanges();
    event.target.value = '';
  }


  //clear fb image
  clearImages() {
    this.uploadedImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    this.uploadedImages = [];
  }

  //clear ig img
  clearIgImages() {
    this.igImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    this.igImages = [];
  }

  //clear twitter img
  clearTwitterImages() {
    this.twitterImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    this.twitterImages = [];
  }

  //clear tiktok img
  clearTikTokImages() {
    this.tiktokImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    this.tiktokImages = [];
  }

  //fb
  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  //ig
  triggerIgFileUpload() {
    this.igFileInput.nativeElement.click();
  }

  //tiktok
  triggerTikTokUpload() {
    this.tiktokFileInput.nativeElement.click();
  }

  //twitter
  triggerTwitterUpload() {
    this.twitterFileInput.nativeElement.click();
  }

  openGallery(index: number) {
    this.activeIndex = index;
    this.displayGallery = true;
    console.log('Opening gallery at index:', index);
  }

  onActiveIndexChange(index: number) {
    this.activeIndex = index;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.uploadedImages) {
      this.uploadedImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    }
    if (this.igImages) {
      this.igImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    }
    if (this.tiktokImages) {
      this.tiktokImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    }
    if (this.twitterImages) {
      this.twitterImages.forEach(img => URL.revokeObjectURL(img._blobUrl));
    }
  }

  openEdit(platform: 'facebook' | 'instagram' | 'tiktok' | 'twitter') {
    this.currentPlatform = platform;
    this.visibleEditCaption = true;
  }


  saveCaption() {
    const form = this.activeForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const newCaption = form.value.postText;
    switch (this.currentPlatform) {
      case 'facebook': this.text = newCaption; break;
      case 'instagram': this.text2 = newCaption; break;
      case 'tiktok': this.text3 = newCaption; break;
      case 'twitter': this.twitterText = newCaption; break;
    }
    this.visibleEditCaption = false;
    this.messageService.add({
      severity: 'success',
      summary: 'สำเร็จ',
      detail: `อัปเดตแคปชั่น ${this.currentPlatform} แล้ว`
    });
  }

  get activeForm(): FormGroup {
    const forms = {
      facebook: this.facebookForm,
      instagram: this.instagramForm,
      tiktok: this.tiktokForm,
      twitter: this.twitterForm
    };
    return forms[this.currentPlatform] ?? this.facebookForm; // 👈 สำคัญ
  }

}