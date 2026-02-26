import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CATEGORY_REPOSITORY, CategoryRepository } from "../../../domain/ports/category.repository";
import { Category, CategoryDomain } from "../../../domain/models/category.model";


@Injectable({ providedIn: "root" })
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private categoryRepo: CategoryRepository,
  ) {}

  execute(data: Omit<Category, "id">): Observable<Category> {
    // Validaciones de negocio — si falla, no llega al repositorio
    if (!CategoryDomain.isValidName(data.name)) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }
    if (!data.description.trim()) {
      throw new Error("La descripción es obligatoria");
    }

    return this.categoryRepo.create(data);
  }
}
