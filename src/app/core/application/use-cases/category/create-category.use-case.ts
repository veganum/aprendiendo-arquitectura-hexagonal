import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category, CategoryDomain } from "../../../domain/models/category.model";
import { CATEGORY_REPOSITORY } from "../../../domain/ports/category.repository";

@Injectable({ providedIn: "root" })
export class CreateCategoryUseCase {
  private readonly categoryRepo = inject(CATEGORY_REPOSITORY);

  execute(data: Omit<Category, "id">): Observable<Category> {
    if (!CategoryDomain.isValidName(data.name)) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }

    if (!data.description.trim()) {
      throw new Error("La descripcion es obligatoria");
    }

    return this.categoryRepo.create(data);
  }
}
