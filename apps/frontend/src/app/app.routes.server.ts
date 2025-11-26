import { RenderMode, ServerRoute } from '@angular/ssr';
import { RoutePaths } from '../shared/routes';

// For routes that include parameters (e.g. inscripcionesxcurso/:id) we avoid Prerender
// unless we explicitly implement getPrerenderParams to supply values. Instead we set
// those dynamic routes to Server render mode, and keep the rest as Prerender.
export const serverRoutes: ServerRoute[] = [
  {
    path: RoutePaths.INSCRIPCIONESXCURSO,
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
