import { TestBed } from '@angular/core/testing';

import { HistoryPage } from './history-page';

describe('HistoryPage', () => {
  let service: HistoryPage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
