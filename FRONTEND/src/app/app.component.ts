import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showLogoutConfirmation: boolean = false;
  notConnectedMessage: string = '';

  constructor(private router: Router) {}

  confirmLogout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notConnectedMessage = 'Vous n\'êtes pas connectés.';
      setTimeout(() => {
        this.notConnectedMessage = '';
      }, 3000);
      return;
    }
    this.showLogoutConfirmation = true;
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
    this.showLogoutConfirmation = false;
  }

  cancelLogout(): void {
    this.showLogoutConfirmation = false;
  }
}
