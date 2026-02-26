// ============================================================
// 📁 CAPA: APLICACIÓN
// 📄 ARCHIVO: get-products.use-case.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Un CASO DE USO representa una acción concreta del usuario:
//   "El usuario quiere ver la lista de productos"
//
//   Coordina entre el Dominio y la Infraestructura.
//   Aplica lógica de negocio ANTES o DESPUÉS de hablar
//   con el repositorio.
//
// ¿POR QUÉ NO LLAMAR AL REPOSITORIO DIRECTO DESDE EL COMPONENTE?
//   Porque si mañana la lógica cambia (ej: solo mostrar productos
//   activos, o paginar), lo cambias aquí UNA VEZ y todos los
//   componentes que usen este caso de uso se benefician.
//
// 💉 INYECCIÓN:
//   Recibe el repositorio por @Inject — no sabe si es mock o real.
//   Eso lo decide app.config.ts
// ============================================================

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/ports/product.repository';
import { Product } from '../../../domain/models/product.model';


@Injectable({ providedIn: 'root' })
export class GetProductsUseCase {

  // @Inject le dice a Angular: "busca el proveedor con este token"
  constructor(
    @Inject(PRODUCT_REPOSITORY) private productRepo: ProductRepository
  ) {}

  // execute() es la convención para los casos de uso
  // Retorna Observable para que el componente pueda suscribirse
  execute(): Observable<Product[]> {
    return this.productRepo.getAll().pipe(
      // Aquí va la lógica de negocio adicional:
      // Por ejemplo: filtrar productos con stock negativo (datos corruptos)
      map(products => products.filter(p => p.stock >= 0))
    );
  }
}
