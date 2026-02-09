import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
@Component({
  selector: 'app-dash-board',
  imports: [
    ButtonModule,
    LottieComponent
  ],
  templateUrl: './dash-board.html',
  styleUrl: './dash-board.css',
})
export class DashBoard {

  constructor(
    private router: Router,
  ) { }

  goToCreatePage() {
    this.router.navigate(['/create']);
  }

  lottieOptions = {
    path: 'assets/lottie/ai_animation_Flow.json',
    loop: true,
    autoplay: true
  };

}
