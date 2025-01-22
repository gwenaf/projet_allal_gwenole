import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
