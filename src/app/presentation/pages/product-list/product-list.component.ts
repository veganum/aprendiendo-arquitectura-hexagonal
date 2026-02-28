// ============================================================
// CAPA: PRESENTACION
// ARCHIVO: product-list.component.ts
// ============================================================
// Componente de lista de productos usando estado reactivo
// con signals y plantillas con control flow moderno.
// ============================================================

import { DecimalPipe } from "@angular/common";
import {
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { CreateProductUseCase } from "../../../core/application/use-cases/product/create-product.use-case";
import { DeleteProductUseCase } from "../../../core/application/use-cases/product/delete-product.use-case";
import { GetProductsUseCase } from "../../../core/application/use-cases/product/get-products.use-case";
import { Product, ProductDomain } from "../../../core/domain/models/product.model";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent {
  private readonly getProductsUseCase = inject(GetProductsUseCase);
  private readonly createProductUseCase = inject(CreateProductUseCase);
  private readonly deleteProductUseCase = inject(DeleteProductUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal("");
  readonly successMessage = signal("");
  readonly showForm = signal(false);
  readonly formError = signal("");
  readonly saving = signal(false);

  readonly draftName = signal("");
  readonly draftPrice = signal(0);
  readonly draftStock = signal(0);
  readonly draftCategory = signal("");

  readonly categories = [
    "Electrónica",
    "Periféricos",
    "Audio",
    "Accesorios",
    "Software",
  ] as const;

  readonly availableCount = computed(
    () =>
      this.products().filter((product) => ProductDomain.isAvailable(product))
        .length,
  );
  readonly uniqueCategories = computed(() => [
    ...new Set(this.products().map((product) => product.category)),
  ]);

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set("");

    this.getProductsUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (err) => {
          this.error.set(`Error al cargar los productos: ${err.message}`);
        },
      });
  }

  createProduct(): void {
    this.formError.set("");
    this.saving.set(true);

    try {
      const newProduct = {
        name: this.draftName(),
        price: this.draftPrice(),
        stock: this.draftStock(),
        category: this.draftCategory(),
      };

      this.createProductUseCase
        .execute(newProduct)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.saving.set(false)),
        )
        .subscribe({
          next: (product) => {
            this.products.update((products) => [...products, product]);
            this.showSuccess(`Producto "${product.name}" creado exitosamente`);
            this.closeForm();
          },
          error: (err) => {
            this.formError.set(err.message);
          },
        });
    } catch (err: any) {
      this.formError.set(err.message);
      this.saving.set(false);
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Eliminar "${product.name}"?`)) {
      return;
    }

    this.deleteProductUseCase
      .execute(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.products.update((products) =>
            products.filter((currentProduct) => currentProduct.id !== product.id),
          );
          this.showSuccess(`Producto "${product.name}" eliminado`);
        },
        error: (err) => {
          this.error.set(err.message);
        },
      });
  }

  isAvailable(product: Product): boolean {
    return ProductDomain.isAvailable(product);
  }

  isExpensive(product: Product): boolean {
    return ProductDomain.isExpensive(product);
  }

  getPriceWithDiscount(product: Product): number {
    return ProductDomain.applyDiscount(product, 10);
  }

  toggleForm(): void {
    this.showForm.update((showForm) => !showForm);
    this.formError.set("");
    this.resetDraft();
  }

  getCountByCategory(category: string): number {
    return this.products().filter((product) => product.category === category).length;
  }

  goToCategories(): void {
    this.router.navigate(["/categorias"]);
  }

  private closeForm(): void {
    this.showForm.set(false);
    this.formError.set("");
    this.resetDraft();
  }

  private resetDraft(): void {
    this.draftName.set("");
    this.draftPrice.set(0);
    this.draftStock.set(0);
    this.draftCategory.set("");
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(""), 3000);
  }
}
