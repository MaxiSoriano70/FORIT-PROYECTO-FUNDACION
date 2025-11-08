import { Routes } from '@angular/router';
import { RoutePaths } from '../shared/routes';
import { ruteoGuard } from '../shared/guards/ruteo.guard';

export const routes: Routes = [
    {
        path: RoutePaths.HOME,
        loadComponent: () =>
        import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: RoutePaths.TIPS,
        loadComponent: () =>
        import('./features/tips/tips.component').then(m => m.TipsComponent)
    },
    {
        path: RoutePaths.USUARIOS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent)
    },
    {
        path: RoutePaths.ALUMNOS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/alumnos/alumnos.component').then(m => m.AlumnosComponent)
    },
    {
        path: RoutePaths.CURSOS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/cursos/cursos.component').then(m => m.CursosComponent)
    },
    {
        path: RoutePaths.INSCRIPCIONES,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/inscripciones/inscripciones.component').then(m => m.InscripcionesComponent)
    },
    {
        path: RoutePaths.ALUMNODETALLE,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/alumnos/view-student/view-student.component').then(m => m.ViewStudentComponent)
    },
    {
        path: RoutePaths.USUARIODETALLE,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/usuarios/view-usuario/view-usuario.component').then(m => m.ViewUsuarioComponent)
    },
    {
    path: RoutePaths.ERROR404,
    loadComponent: () =>
        import('./features/error404/error404.component').then(m => m.Error404Component)
    },
    {
        path: '**',
        redirectTo: RoutePaths.ERROR404
    }
];
