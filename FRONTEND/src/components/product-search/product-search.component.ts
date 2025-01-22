import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-product-search',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-search.component.html',
    styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {
  @Input() products: Product[] = [];
  @Output() filterChange = new EventEmitter<Product[]>();

  searchForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  initForm() {
    this.searchForm = this.fb.group({
      name: [''],
      maxPrice: ['']
    });
  }

  onSearch(): void {
    const { name, category, maxPrice } = this.searchForm.value;

    let filtered = this.products;

    if (name && name.trim() !== '') {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (category && category.trim() !== '') {
      filtered = filtered.filter(p =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (maxPrice && !isNaN(maxPrice)) {
      const priceAsNumber = parseFloat(maxPrice);
      filtered = filtered.filter(p => p.price <= priceAsNumber);
    }

    this.filterChange.emit(filtered);
  }

  onReset(): void {
    this.searchForm.reset({
      name: '',
      category: '',
      maxPrice: ''
    });

    this.filterChange.emit(this.products);
  }
}
