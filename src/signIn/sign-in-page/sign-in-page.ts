import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../app/layouts/auth-layout/service/auth-service';

@Component({
  selector: 'app-sign-in-page',
  imports: [
    DialogModule,
    ButtonModule,
    RouterLink
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

  constructor(
    private router: Router,
    private authService: AuthService

  ) {
    this.currentDate = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async showDialog() {
    const isAccepted = localStorage.getItem('hasAcceptedTerms');

    if (isAccepted === 'true') {
      await this.handleLogin();
    } else {
      this.visible = true;
    }
  }


  goToTerm() {
    this.router.navigate(['/term-condition']);
  }

  async onAccept() {
    if (this.isAccepted) {
      localStorage.setItem('hasAcceptedTerms', 'true');
      this.visible = false;
      await this.handleLogin();
    }
  }


  onDecline() {
    this.visible = false;
  }

  private async handleLogin() {
    try {
      await this.authService.loginGooglePopup();
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

}
