import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, NewProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Base URL do servidor.
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products-list`);
  }

  createProduct(productData: NewProduct): Observable<Product> {
    const payload = {
      nome: productData.nome,
      price: productData.preco
    };
    return this.http.post<Product>(`${this.apiUrl}/new-product`, payload);
  }

  getProductById(id: number): Observable<Product> {
    const path = `/products/${id}`; 
    return this.http.get<Product>(`${this.apiUrl}${path}`);
  }

  updateProduct(id: number, productData: NewProduct): Observable<Product> {
    const payload = {
      nome: productData.nome,
      price: productData.preco
    };
    return this.http.put<Product>(`${this.apiUrl}/update-product/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-product/${id}`);
  }
}