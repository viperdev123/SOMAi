import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../service/history-service';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs/operators'
import { TableModule } from 'primeng/table';

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

  historyData: any[] = [];
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.loadHistory();
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
        next: (response) => {
          console.log('History data loaded:', response);
          this.historyData = response;
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
}
