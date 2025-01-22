import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private compteService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const creds = this.loginForm.value;

      this.authService.login(creds).subscribe({
        next: (response) => {
          if (response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            this.compteService.saveUserToLocalStorage(response.user);

            this.router.navigate(['/catalog']);
          } else {
            console.error('Aucune donnée utilisateur dans la réponse.');
            this.loginError = 'Erreur : Impossible de récupérer les informations utilisateur.';
          }
        },
        error: (err) => {
          this.loginError = err.error?.error || 'Connexion échouée';
        },
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
