import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./presentation/pages/product-list/product-list.component").then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: "categorias",
    loadComponent: () =>
      import("./presentation/pages/category-list/category-list.component").then(
        (m) => m.CategoryListComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
