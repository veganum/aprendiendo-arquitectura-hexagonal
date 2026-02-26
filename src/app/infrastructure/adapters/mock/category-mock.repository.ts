import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { Category } from "../../../core/domain/models/category.model";
import { CategoryRepository } from "../../../core/domain/ports/category.repository";

@Injectable()
export class CategoryMockRepository implements CategoryRepository {
  // Datos falsos para desarrollar sin backend
  private categories: Category[] = [
    {
      id: "1",
      name: "Electrónica",
      description: "Dispositivos y gadgets",
      productCount: 3,
    },
    {
      id: "2",
      name: "Periféricos",
      description: "Accesorios para computadora",
      productCount: 2,
    },
    {
      id: "3",
      name: "Audio",
      description: "Auriculares y parlantes",
      productCount: 1,
    },
    {
      id: "4",
      name: "Sin productos",
      description: "Categoría vacía de prueba",
      productCount: 0,
    },
  ];

  getAll(): Observable<Category[]> {
    return of([...this.categories]).pipe(delay(400));
  }

  getById(id: string): Observable<Category> {
    const category = this.categories.find((c) => c.id === id);
    if (!category)
      return throwError(() => new Error(`Categoría ${id} no encontrada`));
    return of({ ...category }).pipe(delay(200));
  }

  create(data: Omit<Category, "id">): Observable<Category> {
    const newCategory: Category = { ...data, id: Date.now().toString() };
    this.categories.push(newCategory);
    return of({ ...newCategory }).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
    return of(void 0).pipe(delay(200));
  }
}
