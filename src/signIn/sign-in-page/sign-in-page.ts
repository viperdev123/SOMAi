import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sign-in-page',
  imports: [
    DialogModule,
    ButtonModule
  ],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css',
})
export class SignInPage implements OnInit {

  ngOnInit(): void {

  }

  visible: boolean = false;
  currentDate: string = '';
  isAccepted: boolean = false;

  constructor(private router: Router) {
    this.currentDate = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  showDialog() {
    const isAccepted = localStorage.getItem('hasAcceptedTerms');
    if (isAccepted === 'true') {
      this.router.navigate(['/home']);
    } else {
      this.visible = true;
    }
  }

  goToTerm() {
    this.router.navigate(['/term-condition']);
  }

  onAccept() {
    if (this.isAccepted) {
      console.log('User accepted terms.');
      localStorage.setItem('hasAcceptedTerms', 'true');
      this.router.navigate(['/home']);
    }
  }

  onDecline() {
    console.log('User declined terms.');
    this.visible = false;
  }

}
