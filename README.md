# 🏗️ Angular — Arquitectura Hexagonal

Ejemplo completo y didáctico de Arquitectura Hexagonal en Angular 19.
Incluye gestión de **Productos** y **Categorías** como casos de uso reales.

---

## 🚀 Cómo correr el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en desarrollo
ng serve

# 3. Abrir en el navegador
http://localhost:4200           # → Productos
http://localhost:4200/categorias # → Categorías
```

---

## 🧠 ¿Qué es la Arquitectura Hexagonal?

La Arquitectura Hexagonal (también llamada **Ports & Adapters**) fue creada por **Alistair Cockburn** en 2005.

La idea central es muy simple:

> **El núcleo de tu aplicación (la lógica de negocio) no debe saber nada del mundo exterior.**
> No sabe si usas Angular, React, una API REST, una base de datos SQL o datos en memoria.
> Solo sabe QUÉ hacer, nunca CÓMO se conecta con el exterior.

---

## 🔷 El dibujo que lo explica todo

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
   [ UI Angular ] ──┤  PRESENTACIÓN                              │
   [ API REST   ] ──┤  (Adaptadores de entrada)                  │
                    │            │                                │
                    │            ▼                                │
                    │   ┌─────────────────────┐                  │
                    │   │    APLICACIÓN        │                  │
                    │   │   (Casos de Uso)     │                  │
                    │   │         │            │                  │
                    │   │         ▼            │                  │
                    │   │   ┌──────────┐       │                  │
                    │   │   │ DOMINIO  │       │  ← El hexágono   │
                    │   │   │ (núcleo) │       │    (el corazón)  │
                    │   │   └──────────┘       │                  │
                    │   │         │            │                  │
                    │   │         ▼            │                  │
                    │   │    [  PUERTO  ]       │                  │
                    │   │   (interfaz/contrato) │                  │
                    │   └─────────────────────┘                  │
                    │            │                                │
                    │            ▼                                │
                    │  INFRAESTRUCTURA                            │
                    │  (Adaptadores de salida)                    │
                    │                                             │
                    ├──────────────┬──────────────────────────────┤
                    │  Mock Repo   │   HTTP Repo   │   DB Repo   │
                    └──────────────┴──────────────────────────────┘

  ▲ Lo que cambia     ▲ Lo que no cambia      ▲ Lo que cambia
  (UI, frameworks)    (reglas de negocio)     (APIs, bases de datos)
```

**La regla de las flechas:** las dependencias solo apuntan hacia adentro.
El Dominio no conoce a nadie. La Aplicación conoce al Dominio. La Infraestructura conoce al Dominio pero NO a la Aplicación.

---

## 🧩 Los conceptos clave explicados

### 🔵 Dominio

Es el **corazón** de la aplicación. Contiene:

- **Modelos:** la forma de tus datos (`Product`, `Category`). Define qué *es* algo en tu negocio.
- **Reglas de negocio:** lógica que siempre aplica sin importar la tecnología. Por ejemplo: "un producto sin stock no está disponible" o "el precio no puede ser negativo".

No importa `@angular/core`. No importa `HttpClient`. Es TypeScript puro.
Si mañana migras de Angular a React, el Dominio se reutiliza **sin tocar ni una línea**.

```
Pregunta que responde el Dominio:
"¿Qué ES un producto y qué reglas tiene?"
```

---

### 🔌 Puerto (Port)

Es un **contrato** — una interfaz TypeScript que define qué operaciones existen, sin decir cómo se hacen.

```typescript
// El puerto no sabe si los datos vienen de una API, una DB o un array en memoria.
// Solo dice: "quien implemente esto, debe poder hacer estas cosas"
interface ProductRepository {
  getAll(): Observable<Product[]>;
  create(product): Observable<Product>;
  delete(id): Observable<void>;
}
```

Piénsalo como un **enchufe de pared**: define la forma del conector, pero no le importa si la electricidad viene de una central nuclear o paneles solares.

```
Pregunta que responde el Puerto:
"¿Qué PUEDE HACER la app con productos?"
```

---

### 🟡 Caso de Uso (Use Case)

Representa **una acción concreta del usuario**: "ver productos", "crear categoría", "eliminar producto".

Coordina: recibe datos, aplica validaciones de negocio, llama al puerto y devuelve el resultado.
Es el único que conoce tanto el Dominio como el Puerto.

```typescript
// El caso de uso valida antes de guardar
execute(data): Observable<Product> {
  if (data.price <= 0) throw new Error('Precio inválido');  // regla de negocio
  return this.productRepo.create(data);                     // llama al puerto
}
```

```
Pregunta que responde el Caso de Uso:
"¿Qué quiere hacer el usuario y qué reglas aplican?"
```

---

### 🔴 Adaptador (Adapter)

Es la **implementación concreta** del Puerto. Aquí sí se permite usar Angular, HTTP, bases de datos, etc.

Hay dos tipos:

- **Mock:** datos falsos en memoria → para desarrollo y testing
- **HTTP:** llamadas reales a una API → para producción

```typescript
// El adaptador mock implementa el contrato con datos falsos
class ProductMockRepository implements ProductRepository {
  getAll() { return of([{ id: '1', name: 'Laptop' }]); }
}

// El adaptador HTTP implementa el mismo contrato con llamadas reales
class ProductHttpRepository implements ProductRepository {
  getAll() { return this.http.get<Product[]>('/api/products'); }
}
```

```
Pregunta que responde el Adaptador:
"¿CÓMO se obtienen/guardan los datos realmente?"
```

---

### 🟢 Presentación

Son los **componentes Angular** que el usuario ve. Su única responsabilidad es mostrar datos y capturar acciones (clicks, formularios).

**No contiene lógica de negocio.** No valida si un precio es correcto, no sabe cómo se guarda en la API. Solo llama casos de uso y muestra resultados.

```
Pregunta que responde la Presentación:
"¿Cómo ve y usa esto el usuario?"
```

---

## 🔄 El flujo completo — ejemplo real

Cuando el usuario abre la página de productos:

```
1. ProductListComponent.ngOnInit()
        │
        │ llama a
        ▼
2. GetProductsUseCase.execute()
        │
        │ usa el puerto (interfaz)
        ▼
3. ProductRepository.getAll()
        │
        │ implementado por (según app.config.ts)
        ▼
4. ProductMockRepository.getAll()   ← o ProductHttpRepository si es producción
        │
        │ retorna Observable<Product[]>
        ▼
5. El componente recibe los datos y los muestra en pantalla
```

---

## 💡 ¿Por qué es útil? Ejemplos prácticos

| Situación | Sin Hexagonal | Con Hexagonal |
|-----------|---------------|---------------|
| Pasar de mock a API real | Modificar todos los servicios y componentes | Cambiar **1 línea** en `app.config.ts` |
| Hacer tests unitarios | El test necesita hacer llamadas HTTP | El test usa el mock directamente, sin HTTP |
| Cambiar el framework (Angular → React) | Reescribir todo | Solo reescribes la capa de Presentación |
| Nuevo desarrollador en el equipo | Lee código mezclado sin saber dónde ir | Sabe exactamente: negocio en `domain`, lógica en `use-cases`, datos en `infrastructure` |
| Cambiar de base de datos | Afecta a toda la app | Solo cambias el adaptador, nadie más se entera |

---

## 📋 Orden para crear una funcionalidad nueva

Siempre vas de **adentro hacia afuera** — del corazón hacia la UI:

```
1️⃣  MODELO        → ¿Qué datos maneja?         core/domain/models/
2️⃣  PUERTO        → ¿Qué operaciones existen?   core/domain/ports/
3️⃣  CASO DE USO   → ¿Qué quiere el usuario?     core/application/use-cases/
4️⃣  ADAPTADOR     → ¿De dónde vienen los datos? infrastructure/adapters/mock/
5️⃣  app.config.ts → Registrar el proveedor      (modificar archivo existente)
6️⃣  COMPONENTE    → ¿Cómo lo ve el usuario?     presentation/pages/
7️⃣  app.routes.ts → ¿En qué URL aparece?        (modificar archivo existente)
```

> 💡 **Tip clave:** Los pasos 1, 2 y 3 no tocan Angular para nada. Son TypeScript puro.
> Si puedes hacer esos 3 sin importar `@angular/core`, vas bien.
>
> De los archivos existentes, **solo tocas** `app.config.ts` y `app.routes.ts`.
> El resto son archivos nuevos. Así nunca rompes lo que ya funciona.

---

## 📁 Estructura del Proyecto

```
src/app/
│
├── 🔵 core/                               ← EL HEXÁGONO (no depende de nada externo)
│   │
│   ├── domain/
│   │   ├── models/
│   │   │   ├── product.model.ts           ← ¿QUÉ es un producto? + Reglas de negocio
│   │   │   └── category.model.ts          ← ¿QUÉ es una categoría? + Reglas de negocio
│   │   └── ports/
│   │       ├── product.repository.ts      ← CONTRATO: qué operaciones existen para productos
│   │       └── category.repository.ts     ← CONTRATO: qué operaciones existen para categorías
│   │
│   └── application/
│       └── use-cases/
│           ├── get-products.use-case.ts       ← Caso de uso: ver productos
│           ├── create-product.use-case.ts     ← Caso de uso: crear producto
│           ├── delete-product.use-case.ts     ← Caso de uso: eliminar producto
│           ├── get-categories.use-case.ts     ← Caso de uso: ver categorías
│           └── create-category.use-case.ts    ← Caso de uso: crear categoría
│
├── 🔴 infrastructure/                     ← ADAPTADORES (conectan el mundo exterior)
│   └── adapters/
│       ├── mock/
│       │   ├── product-mock.repository.ts     ← Datos FALSOS de productos (desarrollo)
│       │   └── category-mock.repository.ts    ← Datos FALSOS de categorías (desarrollo)
│       └── http/
│           ├── product-http.repository.ts     ← API REAL de productos (producción)
│           └── category-http.repository.ts    ← API REAL de categorías (producción)
│
└── 🟢 presentation/                       ← UI (lo que el usuario ve)
    └── pages/
        ├── product-list/
        │   ├── product-list.component.ts
        │   ├── product-list.component.html
        │   └── product-list.component.scss
        └── category-list/
            ├── category-list.component.ts
            ├── category-list.component.html
            └── category-list.component.scss
│
├── app.routes.ts     ← URLs de la app (/ = productos, /categorias = categorías)
├── app.config.ts     ← 🔑 Aquí eliges mock o API real para CADA funcionalidad
├── app.component.ts  ← Componente raíz — solo tiene <router-outlet>
```

---

## 🔄 Cambiar de Mock a API Real

En `src/app/app.config.ts`, cambia **una línea por funcionalidad**:

```typescript
// DESARROLLO (datos falsos):
{ provide: PRODUCT_REPOSITORY,  useClass: ProductMockRepository  }
{ provide: CATEGORY_REPOSITORY, useClass: CategoryMockRepository }

// PRODUCCIÓN (API real):
{ provide: PRODUCT_REPOSITORY,  useClass: ProductHttpRepository  }
{ provide: CATEGORY_REPOSITORY, useClass: CategoryHttpRepository }
```

El resto de la app no se entera del cambio. ¡Eso es la Arquitectura Hexagonal!

Incluso puedes tener productos en API real y categorías en mock al mismo tiempo,
mientras desarrollas. Cada funcionalidad es independiente.

---

## 🧅 Las capas — resumen rápido

| Capa | Carpeta | Responsabilidad | ¿Conoce a quién? |
|------|---------|-----------------|------------------|
| **Dominio** | `core/domain/` | Qué SON los datos + reglas de negocio | A nadie |
| **Aplicación** | `core/application/` | Casos de uso, validaciones, coordinación | Solo al Dominio |
| **Infraestructura** | `infrastructure/` | Cómo se guardan/obtienen los datos realmente | Solo al Dominio (implementa el Puerto) |
| **Presentación** | `presentation/` | Lo que el usuario ve y hace (Angular) | Solo a la Aplicación (usa los Casos de Uso) |

**Regla de oro:** Las capas internas **NO conocen** las externas. Nunca al revés.

---

## 🧪 ¿Cómo se testea esto?

La arquitectura hexagonal facilita los tests porque cada capa es independiente:

```typescript
// Test del caso de uso — sin Angular, sin HTTP, sin base de datos
it('no debe crear producto con precio negativo', () => {
  const mockRepo = new ProductMockRepository();       // usa el mock directamente
  const useCase  = new CreateProductUseCase(mockRepo);

  expect(() => useCase.execute({ name: 'Test', price: -10, stock: 5, category: 'X' }))
    .toThrow('El precio debe ser mayor a 0');
});

// Test de regla de dominio — ni siquiera necesita el repositorio
it('producto sin stock no está disponible', () => {
  const product = { id: '1', name: 'Test', price: 10, stock: 0, category: 'X' };
  expect(ProductDomain.isAvailable(product)).toBe(false);
});
```

---

## 📖 Glosario rápido

| Término | Significado simple |
|---------|-------------------|
| **Puerto (Port)** | Interfaz/contrato que define QUÉ se puede hacer |
| **Adaptador (Adapter)** | Implementación concreta de un Puerto |
| **Caso de Uso** | Una acción del usuario con su lógica de negocio |
| **Dominio** | El corazón — modelos y reglas de negocio puras |
| **InjectionToken** | Token de Angular para inyectar interfaces (que TypeScript borra en runtime) |
| **Mock** | Implementación falsa para desarrollo y tests |
