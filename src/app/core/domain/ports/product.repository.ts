// ============================================================
// 📁 CAPA: DOMINIO
// 📄 ARCHIVO: product.repository.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Es el "PUERTO" — una INTERFAZ (contrato) que define
//   QUÉ operaciones existen para productos.
//
//   Piénsalo como un enchule de pared: define la forma del
//   enchufe (interfaz), pero no le importa si la electricidad
//   viene de una central nuclear o paneles solares
//   (implementación real o mock).
//
// ⚠️ REGLA DE ORO:
//   Este archivo define el "QUÉ" pero no el "CÓMO".
//   Las implementaciones reales están en /infrastructure/adapters/
//
// 🔑 InjectionToken:
//   Angular necesita un token especial para poder inyectar
//   interfaces (TypeScript las borra en runtime).
//   Con InjectionToken le decimos a Angular cómo identificar
//   esta dependencia.
// ============================================================

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

// El CONTRATO: cualquier repositorio de productos DEBE implementar esto
export interface ProductRepository {
  getAll(): Observable<Product[]>;
  getById(id: string): Observable<Product>;
  create(product: Omit<Product, 'id'>): Observable<Product>;   // Omit<> = todo excepto 'id'
  update(id: string, product: Partial<Product>): Observable<Product>; // Partial<> = campos opcionales
  delete(id: string): Observable<void>;
}

// Token para Angular Dependency Injection
// Esto reemplaza el string 'PRODUCT_REPOSITORY' — es más seguro y tipado
export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');
