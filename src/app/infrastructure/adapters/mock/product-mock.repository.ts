// ============================================================
// 📁 CAPA: INFRAESTRUCTURA
// 📄 ARCHIVO: product-mock.repository.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   El ADAPTADOR con datos FALSOS (mock).
//   Implementa la interfaz ProductRepository del Dominio,
//   pero en vez de llamar a una API real, usa un array local.
//
// ¿PARA QUÉ SIRVE?
//   1. Desarrollo: trabajas en la UI sin necesitar backend
//   2. Tests: pruebas unitarias sin llamadas HTTP reales
//   3. Demo: mostrar la app sin internet
//
// 🔄 CAMBIAR A API REAL:
//   Solo vas a app.config.ts y cambias:
//     useClass: ProductMockRepository  →  useClass: ProductHttpRepository
//   ¡El resto de la app no se entera del cambio!
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../../../core/domain/models/product.model';
import { ProductRepository } from '../../../core/domain/ports/product.repository';

@Injectable()
export class ProductMockRepository implements ProductRepository {

  // Base de datos FALSA en memoria
  private products: Product[] = [
    { id: '1', name: 'Laptop Dell XPS 15', price: 1200, stock: 5, category: 'Electrónica' },
    { id: '2', name: 'Mouse Logitech MX', price: 35, stock: 20, category: 'Periféricos' },
    { id: '3', name: 'Teclado Mecánico', price: 89, stock: 0, category: 'Periféricos' },
    { id: '4', name: 'Monitor 4K LG', price: 450, stock: 3, category: 'Electrónica' },
    { id: '5', name: 'Auriculares Sony', price: 280, stock: 8, category: 'Audio' },
    { id: '6', name: 'Webcam Logitech C920', price: 95, stock: 12, category: 'Periféricos' },
  ];

  // of() crea un Observable de un valor estático
  // delay() simula la latencia de red (500ms)
  getAll(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(500));
  }

  getById(id: string): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      return throwError(() => new Error(`Producto con id ${id} no encontrado`));
    }
    return of({ ...product }).pipe(delay(200));
  }

  create(data: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = {
      ...data,
      id: Date.now().toString() // ID generado por timestamp
    };
    this.products.push(newProduct);
    return of({ ...newProduct }).pipe(delay(300));
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Producto con id ${id} no encontrado`));
    }
    this.products[index] = { ...this.products[index], ...data };
    return of({ ...this.products[index] }).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Producto con id ${id} no encontrado`));
    }
    this.products.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }
}
