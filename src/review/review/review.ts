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
import { Router } from '@angular/router';
import { ReviewService } from '../service/review-service';
import { LottieComponent } from 'ngx-lottie';

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
    LottieComponent
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
    private sanitizer: DomSanitizer,
    private router: Router,
    private reviewStateService: ReviewService
  ) { }

  availablePlatforms = new Set<string>();
  facebookCaption!: string;
  instagramCaption!: string
  tiktokCaption!: string;
  twitterCaption!: string;
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
  generateData: any = null;
  currentContent!: any;
  visibleRegenDialog: boolean = false;
  regenComment: string = '';
  selectedPlatform!: string;
  loadingRegen = false;


  ngOnInit() {
    this.initForms();
    this.getDataFromAi();
  }

  ngOnChanges() {
    if (this.generateData) {
      this.getDataFromAi();
    }
  }

  initForms() {
    this.facebookForm = new FormGroup({
      postText: new FormControl(this.facebookCaption, [Validators.required, Validators.maxLength(5000)])
    });

    this.instagramForm = new FormGroup({
      postText: new FormControl(this.instagramCaption, [Validators.required, Validators.maxLength(2200)])
    });

    this.tiktokForm = new FormGroup({
      postText: new FormControl(this.tiktokCaption, [Validators.required, Validators.maxLength(2200)])
    });

    this.twitterForm = new FormGroup({
      postText: new FormControl(this.twitterCaption, [Validators.required, Validators.maxLength(280)])
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
      case 'facebook': this.facebookCaption = newCaption; break;
      case 'instagram': this.instagramCaption = newCaption; break;
      case 'tiktok': this.tiktokCaption = newCaption; break;
      case 'twitter': this.twitterCaption = newCaption; break;
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

  lottieOptions = {
    path: 'assets/lottie/Empty_box.json',
    loop: true,
    autoplay: true
  };

  goToCreate() {
    this.router.navigate(['/create']);
  }

  getDataFromAi() {
    this.generateData = this.reviewStateService.getData();
    const contents = this.generateData?.data?.contents || [];

    contents.forEach((item: any) => {
      const platform = item?.platform;
      const text = item?.content || '';

      if (!platform) return;

      this.availablePlatforms.add(platform);

      switch (platform) {
        case 'Facebook':
          this.facebookCaption = text;
          this.facebookForm.patchValue({ postText: text });
          break;

        case 'Instagram':
          this.instagramCaption = text;
          this.instagramForm.patchValue({ postText: text });
          break;

        case 'Tiktok':
          this.tiktokCaption = text;
          this.tiktokForm.patchValue({ postText: text });
          break;

        case 'X':
          this.twitterCaption = text;
          this.twitterForm.patchValue({ postText: text });
          break;
      }
    });
  }

  showRegenContentDialog(platform: string) {
    this.visibleRegenDialog = true;
    this.selectedPlatform = platform;
    this.regenComment = '';
    switch (platform) {
      case "Facebook":
        this.currentContent = this.facebookCaption;
        break;
      case "Instagram":
        this.currentContent = this.instagramCaption;
        break;
      case "Tiktok":
        this.currentContent = this.tiktokCaption;
        break;
      case "Twitter":
        this.currentContent = this.twitterCaption;
        break;
    }
  }

  regenerateContent() {
    this.loadingRegen = true;
    const payload = {
      platforms: this.selectedPlatform,
      old_content: this.currentContent,
      comment: this.regenComment
    };
    this.reviewStateService.regenerateContent(payload).subscribe({
      next: (res) => {
        if (!res.result) return;
        const text = res.result;
        switch (this.selectedPlatform) {
          case "Facebook":
            this.facebookCaption = text;
            break;
          case "Instagram":
            this.instagramCaption = text;
            break;
          case "Tiktok":
            this.tiktokCaption = text;
            break;
          case "X":
            this.twitterCaption = text;
            break;
        }
        this.loadingRegen = false;
        this.visibleRegenDialog = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRegen = false;
      }
    });

  }



}