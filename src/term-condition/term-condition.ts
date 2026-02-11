import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-term-condition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './term-condition.html',
  styleUrl: './term-condition.css',
})
export class TermCondition {

  isAccepted: boolean = false;
  currentDate: string = '';
  constructor(
    private router: Router

  ) {
    this.currentDate = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    this.router.navigate(['/sign-in']);
  }
}