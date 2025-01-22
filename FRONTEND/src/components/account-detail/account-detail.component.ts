import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService, UserData } from '../../services/account.service';
import { ToUpperFirstCharacterPipe } from '../../pipes/toUpperFirstCharacter';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-account-detail',
  imports: [CommonModule, ToUpperFirstCharacterPipe, NgIf],
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css'],
})
export class AccountDetailComponent implements OnInit {
  compteData: UserData | null = null;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.loadUserFromLocalStorage();
    this.compteData = this.accountService.getLocalUser();

    if (!this.compteData) {
      this.accountService.getUserFromBackend().subscribe({
        next: (user) => {
          this.compteData = user;
          this.accountService.saveUserToLocalStorage(user);
        },
        error: (err) => {
          console.error('Error while trying to fetch user data:', err);
          this.router.navigate(['/login']);
        },
      });
    }
  }

  onEditClick(): void {
    this.router.navigate(['/account-form']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
