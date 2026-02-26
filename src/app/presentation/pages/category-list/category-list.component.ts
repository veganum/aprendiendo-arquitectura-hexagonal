import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Category,
  CategoryDomain,
} from "../../../core/domain/models/category.model";
import { GetCategoriesUseCase } from "../../../core/application/use-cases/category/get-categories.use-case";
import { CreateCategoryUseCase } from "../../../core/application/use-cases/category/create-category.use-case";


@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = "";
  successMessage = "";
  showForm = false;
  saving = false;
  formError = "";

  newCategory = { name: "", description: "", productCount: 0 };

  constructor(
    private getCategoriesUseCase: GetCategoriesUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  ngOnInit(): void {
    this.getCategoriesUseCase.execute().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  createCategory(): void {
    this.formError = "";
    this.saving = true;
    try {
      this.createCategoryUseCase.execute(this.newCategory).subscribe({
        next: (category) => {
          this.categories.push(category);
          this.successMessage = `"${category.name}" creada correctamente`;
          setTimeout(() => (this.successMessage = ""), 3000);
          this.newCategory = { name: "", description: "", productCount: 0 };
          this.showForm = false;
          this.saving = false;
        },
        error: (err) => {
          this.formError = err.message;
          this.saving = false;
        },
      });
    } catch (err: any) {
      this.formError = err.message;
      this.saving = false;
    }
  }

  // Usa la lógica del DOMINIO — no pongas esta lógica en el HTML
  hasProducts(category: Category): boolean {
    return CategoryDomain.hasProducts(category);
  }
}
