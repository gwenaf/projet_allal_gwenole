import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AddToCart } from '../../store/cart.state';
import { Store } from '@ngxs/store';
import { CartState } from '../../store/cart.state';


@Component({
  standalone: true,
  selector: 'app-catalog',
  imports: [
     CommonModule,
     ProductSearchComponent,
     RouterLink
   ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  totalCount$!: Observable<number>;

  constructor(private productService: ProductService, private store: Store) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.totalCount$ = this.store.select(CartState.getTotalCount);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des produits :', err);
      },
    });
  }

  onFilterChange(filteredList: Product[]): void {
    this.filteredProducts = filteredList;
  }

  addProductToCart(product: Product): void {
    this.store.dispatch(new AddToCart(product));
  }
}
