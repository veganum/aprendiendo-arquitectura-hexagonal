// ============================================================
// 📄 ARCHIVO: main.ts
// ============================================================
// ¿QUÉ ES ESTO?
//   El PUNTO DE ENTRADA de la aplicación.
//   Es el primer archivo que ejecuta Angular.
//
//   bootstrapApplication() le dice a Angular:
//   "Arranca con AppComponent como componente raíz
//    y usa esta configuración (appConfig)"
//
// ⚠️ Normalmente no necesitas tocar este archivo.
// ============================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la app:', err));
