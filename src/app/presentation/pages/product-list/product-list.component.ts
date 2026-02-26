// ============================================================
// 📁 CAPA: PRESENTACIÓN
// 📄 ARCHIVO: product-list.component.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   El componente Angular que el usuario VE.
//   Su única responsabilidad es MOSTRAR datos y capturar
//   acciones del usuario (clicks, formularios).
//
// ⚠️ REGLA DE ORO:
//   Este componente NO contiene lógica de negocio.
//   No valida si el precio es correcto, no sabe cómo
//   guardar en la API. Solo llama casos de uso y muestra resultados.
//
// 💉 INYECTA:
//   - GetProductsUseCase  → para cargar la lista
//   - CreateProductUseCase → para agregar un producto
//   - DeleteProductUseCase → para eliminar
//   NUNCA inyecta el repositorio directamente
// ============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductDomain } from '../../../core/domain/models/product.model';

import { Router } from '@angular/router';
import { GetProductsUseCase } from '../../../core/application/use-cases/product/get-products.use-case';
import { CreateProductUseCase } from '../../../core/application/use-cases/product/create-product.use-case';
import { DeleteProductUseCase } from '../../../core/application/use-cases/product/delete-product.use-case';

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  // Estado del componente
  products: Product[] = [];
  loading = true;
  error = "";
  successMessage = "";

  // Estado del formulario para crear producto
  showForm = false;
  newProduct = {
    name: "",
    price: 0,
    stock: 0,
    category: "",
  };
  formError = "";
  saving = false;

  categories = [
    "Electrónica",
    "Periféricos",
    "Audio",
    "Accesorios",
    "Software",
  ];

  // ✅ Inyecta CASOS DE USO, nunca el repositorio directamente
  constructor(
    private getProductsUseCase: GetProductsUseCase,
    private createProductUseCase: CreateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Carga productos usando el caso de uso
  loadProducts(): void {
    this.loading = true;
    this.error = "";

    this.getProductsUseCase.execute().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Error al cargar los productos: " + err.message;
        this.loading = false;
      },
    });
  }

  // Crear producto — delega al caso de uso
  createProduct(): void {
    this.formError = "";
    this.saving = true;

    try {
      // El caso de uso valida las reglas de negocio
      // Si hay error de validación, lanza una excepción
      this.createProductUseCase.execute(this.newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.showSuccessMessage(
            `Producto "${product.name}" creado exitosamente`,
          );
          this.resetForm();
          this.saving = false;
        },
        error: (err) => {
          this.formError = err.message;
          this.saving = false;
        },
      });
    } catch (err: any) {
      // Error de validación del caso de uso (síncrono)
      this.formError = err.message;
      this.saving = false;
    }
  }

  // Eliminar producto
  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;

    this.deleteProductUseCase.execute(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.showSuccessMessage(`Producto "${product.name}" eliminado`);
      },
      error: (err) => {
        this.error = err.message;
      },
    });
  }

  // Usa la lógica del DOMINIO para saber si está disponible
  // La regla vive en ProductDomain, no aquí
  isAvailable(product: Product): boolean {
    return ProductDomain.isAvailable(product);
  }

  // Usa la lógica del DOMINIO para saber si es caro
  isExpensive(product: Product): boolean {
    return ProductDomain.isExpensive(product);
  }

  // Calcula precio con descuento usando lógica del DOMINIO
  getPriceWithDiscount(product: Product): number {
    return ProductDomain.applyDiscount(product, 10); // 10% de descuento
  }

  // Helpers del componente
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.formError = "";
    this.resetForm();
  }

  private resetForm(): void {
    this.newProduct = { name: "", price: 0, stock: 0, category: "" };
    this.showForm = false;
  }

  private showSuccessMessage(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ""), 3000);
  }

  // Contador por categoría (útil para el resumen)
  getCountByCategory(category: string): number {
    return this.products.filter((p) => p.category === category).length;
  }

  get uniqueCategories(): string[] {
    return [...new Set(this.products.map((p) => p.category))];
  }

  get availableCount(): number {
    return this.products.filter((p) => ProductDomain.isAvailable(p)).length;
  }

  goToCategories(): void {
    this.router.navigate(["/categorias"]);
  }
}
