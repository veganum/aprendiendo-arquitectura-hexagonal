import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PRODUCT_REPOSITORY } from "../../../domain/ports/product.repository";

@Injectable({ providedIn: "root" })
export class DeleteProductUseCase {
  private readonly productRepo = inject(PRODUCT_REPOSITORY);

  execute(id: string): Observable<void> {
    if (!id) {
      throw new Error("El ID del producto es requerido para eliminarlo");
    }

    return this.productRepo.delete(id);
  }
}
