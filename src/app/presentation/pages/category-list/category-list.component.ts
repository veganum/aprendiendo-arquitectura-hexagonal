import { Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";
import { CreateCategoryUseCase } from "../../../core/application/use-cases/category/create-category.use-case";
import { GetCategoriesUseCase } from "../../../core/application/use-cases/category/get-categories.use-case";
import {
  Category,
  CategoryDomain,
} from "../../../core/domain/models/category.model";

@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent {
  private readonly getCategoriesUseCase = inject(GetCategoriesUseCase);
  private readonly createCategoryUseCase = inject(CreateCategoryUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly error = signal("");
  readonly successMessage = signal("");
  readonly showForm = signal(false);
  readonly saving = signal(false);
  readonly formError = signal("");

  readonly draftName = signal("");
  readonly draftDescription = signal("");

  readonly categoryCount = computed(() => this.categories().length);

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set("");

    this.getCategoriesUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
        error: (err) => {
          this.error.set(err.message);
        },
      });
  }

  createCategory(): void {
    this.formError.set("");
    this.saving.set(true);

    try {
      this.createCategoryUseCase
        .execute({
          name: this.draftName(),
          description: this.draftDescription(),
          productCount: 0,
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.saving.set(false)),
        )
        .subscribe({
          next: (category) => {
            this.categories.update((categories) => [...categories, category]);
            this.successMessage.set(`"${category.name}" creada correctamente`);
            setTimeout(() => this.successMessage.set(""), 3000);
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

  toggleForm(): void {
    this.showForm.update((showForm) => !showForm);
    this.formError.set("");
    this.resetDraft();
  }

  hasProducts(category: Category): boolean {
    return CategoryDomain.hasProducts(category);
  }

  private closeForm(): void {
    this.showForm.set(false);
    this.formError.set("");
    this.resetDraft();
  }

  private resetDraft(): void {
    this.draftName.set("");
    this.draftDescription.set("");
  }
}
