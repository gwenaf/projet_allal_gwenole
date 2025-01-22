import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  standalone: true,
  selector: 'app-account-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent implements OnInit {
  accountForm!: FormGroup;
  userId: number | null = null;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private compteService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser && localUser.id) {
      this.userId = localUser.id;
      this.accountForm.patchValue(localUser);
    }
  }

  private initForm(): void {
    this.accountForm = this.fb.group({
      gender: ['M', Validators.required],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid && this.userId) {
      const data = this.accountForm.value;
      this.compteService.updateUserById(this.userId, data).subscribe({
        next: (res) => {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.successMessage = 'Votre compte a été mis à jour avec succès !';
          this.router.navigate(['/compte-recap']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l’utilisateur :', err);
          alert('Une erreur est survenue. Veuillez réessayer.');
        },
      });
    } else {
      alert('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }
}
