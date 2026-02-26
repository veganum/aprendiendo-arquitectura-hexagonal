// ============================================================
// 📁 CAPA: APLICACIÓN
// 📄 ARCHIVO: create-product.use-case.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Caso de uso: "El usuario quiere crear un nuevo producto"
//
//   Aquí van las VALIDACIONES DE NEGOCIO antes de guardar.
//   Si el precio es 0 o el nombre está vacío, falla aquí —
//   no llega ni al repositorio.
//
// 💡 DIFERENCIA con validaciones del formulario:
//   - Validaciones del formulario (HTML): "el campo es requerido"
//   - Validaciones del caso de uso: "el precio debe ser > 0 porque
//     el negocio no permite productos gratuitos"
// ============================================================

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/ports/product.repository';
import { Product } from '../../../domain/models/product.model';


@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY) private productRepo: ProductRepository
  ) {}

  // Omit<Product, 'id'> = recibe todos los campos EXCEPTO el id
  // (porque el id lo genera el servidor o el repositorio)
  execute(productData: Omit<Product, 'id'>): Observable<Product> {

    // ✅ Validaciones de NEGOCIO — fallan antes de tocar el servidor
    if (productData.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (!productData.name || !productData.name.trim()) {
      throw new Error('El nombre del producto es obligatorio');
    }

    if (productData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Si pasó todas las validaciones → guardar
    return this.productRepo.create(productData);
  }
}
