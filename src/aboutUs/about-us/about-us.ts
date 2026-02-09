import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  constructor(
    private router: Router,
  ) { }
  
  goToPageCreate() {
    this.router.navigate(['/create']);
  }

}
