// ============================================================
// 📁 CAPA: INFRAESTRUCTURA
// 📄 ARCHIVO: product-http.repository.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   El ADAPTADOR con llamadas HTTP REALES.
//   Cuando tu backend esté listo, activas este en app.config.ts
//   y toda la app empieza a usar la API sin cambiar nada más.
//
// 🔧 PARA ACTIVARLO:
//   En app.config.ts cambia:
//     useClass: ProductMockRepository
//   por:
//     useClass: ProductHttpRepository
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../core/domain/models/product.model';
import { ProductRepository } from '../../../core/domain/ports/product.repository';

@Injectable()
export class ProductHttpRepository implements ProductRepository {

  // 🔧 Cambia esta URL por la de tu API real
  private apiUrl = 'https://tu-api.com/api/products';

  // HttpClient viene de Angular — aquí SÍ usamos cosas de Angular
  // porque estamos en la capa de Infraestructura, no en el Dominio
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
