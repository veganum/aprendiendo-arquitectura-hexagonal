import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CATEGORY_REPOSITORY, CategoryRepository } from "../../../domain/ports/category.repository";
import { Category } from "../../../domain/models/category.model";


@Injectable({ providedIn: "root" })
export class GetCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private categoryRepo: CategoryRepository,
  ) {}

  execute(): Observable<Category[]> {
    return this.categoryRepo.getAll();
  }
}
