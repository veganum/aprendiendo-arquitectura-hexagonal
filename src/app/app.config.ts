// ============================================================
// 📄 ARCHIVO: app.config.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   La CONFIGURACIÓN CENTRAL de la app.
//   Aquí registras todos los "proveedores" (providers):
//   servicios, repositorios, interceptores, etc.
//
// 🔑 LA PARTE MÁS IMPORTANTE DE ARQUITECTURA HEXAGONAL:
//   Aquí decides QUÉ implementación usar para cada puerto.
//
//   Para usar datos MOCK (desarrollo/demo):
//     useClass: ProductMockRepository   ← datos falsos en memoria
//
//   Para usar API REAL (producción):
//     useClass: ProductHttpRepository   ← llamadas HTTP reales
//
//   Solo cambias UNA LÍNEA y toda la app cambia de implementación.
//   Los componentes, casos de uso y dominio no se enteran.
// ============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { PRODUCT_REPOSITORY } from './core/domain/ports/product.repository';

// ↓ Importa el adaptador que quieras usar
import { ProductMockRepository } from './infrastructure/adapters/mock/product-mock.repository';
import { CategoryMockRepository } from './infrastructure/adapters/mock/category-mock.repository';
import { CATEGORY_REPOSITORY } from './core/domain/ports/category.repository';
// import { ProductHttpRepository } from './infrastructure/adapters/http/product-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🗺️ Activa el sistema de rutas con las rutas de app.routes.ts
    provideRouter(routes),

    // 🌐 Activa el HttpClient de Angular (necesario para ProductHttpRepository)
    provideHttpClient(),

    // 🔌 Aquí "enchufas" la implementación del repositorio
    // Angular inyectará ProductMockRepository donde se pida PRODUCT_REPOSITORY
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductMockRepository, // 👈 Cambia a ProductHttpRepository para la API real
    },

    { provide: CATEGORY_REPOSITORY, useClass: CategoryMockRepository },
  ],
};
