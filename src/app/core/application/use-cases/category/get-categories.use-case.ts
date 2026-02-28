import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../../../domain/models/category.model";
import { CATEGORY_REPOSITORY } from "../../../domain/ports/category.repository";

@Injectable({ providedIn: "root" })
export class GetCategoriesUseCase {
  private readonly categoryRepo = inject(CATEGORY_REPOSITORY);

  execute(): Observable<Category[]> {
    return this.categoryRepo.getAll();
  }
}
