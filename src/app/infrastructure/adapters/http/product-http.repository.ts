import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../../core/domain/models/product.model";
import { ProductRepository } from "../../../core/domain/ports/product.repository";

@Injectable()
export class ProductHttpRepository implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "https://tu-api.com/api/products";

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Product, "id">): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
