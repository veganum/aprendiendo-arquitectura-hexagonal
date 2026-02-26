// ============================================================
// 📄 ARCHIVO: app.routes.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Define las RUTAS de la aplicación.
//   Cada ruta relaciona una URL con un componente.
//
//   Ejemplo:
//     URL: /          → muestra ProductListComponent
//     URL: /cualquier → redirige a /
//
// 💡 Para agregar más páginas solo añades más objetos al array.
// ============================================================

import { Routes } from '@angular/router';
import { ProductListComponent } from './presentation/pages/product-list/product-list.component';
import { CategoryListComponent } from './presentation/pages/category-list/category-list.component';

export const routes: Routes = [
  {
    path: "", // URL raíz: localhost:4200/
    component: ProductListComponent, // ← muestra este componente
  },
  { path: "categorias", component: CategoryListComponent },
  {
    path: "**", // Cualquier ruta desconocida
    redirectTo: "", // ← redirige al inicio
  },
];
