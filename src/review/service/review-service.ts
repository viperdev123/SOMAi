import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private data: any = null;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  clear() {
    this.data = null;
  }
}
