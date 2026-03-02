import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../service/history-service';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs/operators'
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    Button
  ],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export class HistoryPage implements OnInit {

  accessToken = '';
  historyData: any[] = [];
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken') || '';
    }
    if (this.accessToken) {
      this.loadHistory();
    }
  }

  loadHistory() {
    this.isLoading = true;

    this.historyService.getData()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: any) => {
          const rows = response?.data?.rows ?? [];

          this.historyData = rows.map((item: any) => {
            const dateObj = new Date(item.timestamp);

            return {
              Date: dateObj,
              Time: dateObj.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              Platform: item.platform,
              Url: item.link
            };
          });

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  refreshHistory() {
    this.historyService.clearCache();
    this.loadHistory();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
