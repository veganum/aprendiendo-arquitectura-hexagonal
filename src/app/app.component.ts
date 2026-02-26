// ============================================================
// 📄 ARCHIVO: app.component.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   El componente RAÍZ. Es el primero que carga Angular.
//   Es como el "marco" de tu aplicación.
//
//   En una app con routing, este componente solo necesita
//   tener <router-outlet> que es el "hueco" donde Angular
//   inyecta el componente que corresponde a la URL actual.
//
//   URL: /          → <router-outlet> muestra ProductListComponent
//   URL: /perfil    → <router-outlet> mostraría ProfileComponent
//
// 💡 Si quieres un Navbar o Footer que aparezca en TODAS las
//    páginas, ponlos aquí junto al <router-outlet>
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',      // El HTML usa <app-root> en index.html
  standalone: true,
  imports: [RouterOutlet],   // Necesario para usar <router-outlet>
  template: `
    <!-- Aquí podrías poner un <nav> global -->

    <!-- router-outlet = el "hueco" donde van los componentes según la URL -->
    <router-outlet></router-outlet>

    <!-- Aquí podrías poner un <footer> global -->
  `
})
export class AppComponent {
  // Este componente no necesita lógica
  // Solo es el contenedor principal
}
