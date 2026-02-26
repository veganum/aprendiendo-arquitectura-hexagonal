// ============================================================
// 📁 CAPA: DOMINIO
// 📄 ARCHIVO: product.model.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   Define la "forma" de un Producto en tu negocio.
//   También contiene REGLAS DE NEGOCIO puras (lógica que
//   siempre aplica sin importar si usas Angular, React, etc.)
//
// ⚠️ REGLA DE ORO:
//   Este archivo NO importa nada de Angular, HTTP ni librerías
//   externas. Es puro TypeScript. Si mañana cambias de Angular
//   a React, este archivo se reutiliza SIN CAMBIOS.
// ============================================================

// La "forma" de un producto — lo que el negocio entiende
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Clase con REGLAS DE NEGOCIO
// Estas reglas viven aquí porque aplican siempre,
// no importa si los datos vienen de una API, base de datos o mock
export class ProductDomain {

  // ¿Está disponible el producto?
  // Regla: solo si tiene stock mayor a 0
  static isAvailable(product: Product): boolean {
    return product.stock > 0;
  }

  // Calcular precio con descuento
  // Regla: el descuento debe estar entre 0 y 100
  static applyDiscount(product: Product, percentage: number): number {
    if (percentage < 0 || percentage > 100) {
      throw new Error('El descuento debe ser entre 0 y 100');
    }
    return product.price * (1 - percentage / 100);
  }

  // ¿Es un producto caro? (más de $500)
  // Este tipo de reglas viven aquí, no en el componente visual
  static isExpensive(product: Product): boolean {
    return product.price > 500;
  }
}
