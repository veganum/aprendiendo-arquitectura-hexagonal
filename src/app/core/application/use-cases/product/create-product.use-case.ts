import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../../domain/models/product.model";
import { PRODUCT_REPOSITORY } from "../../../domain/ports/product.repository";

@Injectable({ providedIn: "root" })
export class CreateProductUseCase {
  private readonly productRepo = inject(PRODUCT_REPOSITORY);

  execute(productData: Omit<Product, "id">): Observable<Product> {
    if (productData.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }

    if (!productData.name || !productData.name.trim()) {
      throw new Error("El nombre del producto es obligatorio");
    }

    if (productData.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    return this.productRepo.create(productData);
  }
}
