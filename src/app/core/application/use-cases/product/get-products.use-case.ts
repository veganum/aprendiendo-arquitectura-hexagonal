import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Product } from "../../../domain/models/product.model";
import { PRODUCT_REPOSITORY } from "../../../domain/ports/product.repository";

@Injectable({ providedIn: "root" })
export class GetProductsUseCase {
  private readonly productRepo = inject(PRODUCT_REPOSITORY);

  execute(): Observable<Product[]> {
    return this.productRepo
      .getAll()
      .pipe(map((products) => products.filter((product) => product.stock >= 0)));
  }
}
