import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService, Card } from '../../services/card.service';
import { Signal } from '@angular/core';
import { ObfuscateCardPipe } from '../../pipes/obfuscate-card.pipe';
import { NgForOf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, ObfuscateCardPipe, NgForOf],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  carteForm!: FormGroup;
  cards!: Signal<Card[]>;
  selectedCardId: number | null = null;

  constructor(private fb: FormBuilder, private cardService: CardService) {}

  ngOnInit(): void {
    this.initForm();
    this.cards = this.cardService.getCards();
  }

  private initForm(): void {
    this.carteForm = this.fb.group({
      nomCarte: ['', [Validators.required, Validators.minLength(3)]],
      codeCarte: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{16}$')
        ]
      ],
      ccv: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{3}$')
        ]
      ],
      dateExpiration: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/(\\d{4})$')
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.carteForm.valid) {
      const newCard: Card = { id: this.selectedCardId || Date.now(), ...this.carteForm.value };

      if (this.selectedCardId) {
        this.cardService.updateCard(this.selectedCardId, newCard);
      } else {
        this.cardService.addCard(newCard);
      }

      this.resetForm();
    }
  }

  resetForm(): void {
    this.selectedCardId = null;
    this.carteForm.reset();
  }

  removeCard(cardId: number): void {
    this.cardService.removeCard(cardId);

    if (this.selectedCardId === cardId) {
      this.resetForm();
    }
  }

  editCard(cardId: number): void {
    const card = this.cardService.getCardById(cardId);
    if (card) {
      this.selectedCardId = cardId;
      this.carteForm.patchValue({
        nomCarte: card.nomCarte,
        codeCarte: card.codeCarte,
        ccv: card.ccv,
        dateExpiration: card.dateExpiration
      });
    }
  }
}
