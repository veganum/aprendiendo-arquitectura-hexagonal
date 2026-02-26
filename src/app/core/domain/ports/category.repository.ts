import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../models/category.model";


// El CONTRATO — qué operaciones existen
export interface CategoryRepository {
  getAll(): Observable<Category[]>;
  getById(id: string): Observable<Category>;
  create(category: Omit<Category, "id">): Observable<Category>;
  delete(id: string): Observable<void>;
}

// Token para Angular — igual que hiciste con productos
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>(
  "CategoryRepository",
);
