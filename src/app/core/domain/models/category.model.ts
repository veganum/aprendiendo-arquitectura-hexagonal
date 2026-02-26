// ¿QUÉ ES una categoría en tu negocio?
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number; // cuántos productos tiene
}

// Reglas de negocio puras
export class CategoryDomain {
  static hasProducts(category: Category): boolean {
    return category.productCount > 0;
  }

  static isValidName(name: string): boolean {
    return name.trim().length >= 3;
  }
}
