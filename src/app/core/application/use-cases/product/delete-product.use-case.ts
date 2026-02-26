// ============================================================
// 📁 CAPA: APLICACIÓN
// 📄 ARCHIVO: delete-product.use-case.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Caso de uso: "El usuario quiere eliminar un producto"
// ============================================================

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/ports/product.repository';


@Injectable({ providedIn: 'root' })
export class DeleteProductUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY) private productRepo: ProductRepository
  ) {}

  execute(id: string): Observable<void> {
    if (!id) {
      throw new Error('El ID del producto es requerido para eliminarlo');
    }
    return this.productRepo.delete(id);
  }
}
