import { Routes } from '@angular/router';
import { RoutePaths } from '../shared/routes';
import { ruteoGuard } from '../shared/guards/ruteo.guard';
import { InformacionComponent } from './features/informacion/informacion.component';

export const routes: Routes = [
    {
        path: RoutePaths.HOME,
        loadComponent: () =>
        import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: RoutePaths.CATEGORIAS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/categorias/categorias.component').then(m => m.CategoriasComponent)
    },
    {
        path: RoutePaths.USUARIOS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent)
    },
    {
        path: RoutePaths.USUARIODETALLE,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/usuarios/view-usuario/view-usuario.component').then(m => m.ViewUsuarioComponent)
    },
    {
        path: RoutePaths.CURSOS,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/cursos/cursos.component').then(m => m.CursosComponent)
    },
    {
        path: RoutePaths.CURSOSDETALLE,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/cursos/view-curso/view-curso.component').then(m => m.ViewCursoComponent)
    },
    {
        path: RoutePaths.ESTUDIANTES,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/alumnos/alumnos.component').then(m => m.AlumnosComponent)
    },
    {
        path: RoutePaths.ESTUDIANTEDETALLE,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/alumnos/view-student/view-student.component').then(m => m.ViewStudentComponent)
    },
    {
        path: RoutePaths.INFORMACION,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/informacion/informacion.component').then(m => m.InformacionComponent)
    },
    {
        path: RoutePaths.INSCRIPCIONES,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/inscripciones/inscripciones.component').then(m => m.InscripcionesComponent)
    },
    {
        path: RoutePaths.INSCRIPCIONESXCURSO,
        canActivate: [ruteoGuard(['ADMIN'])],
        loadComponent: () =>
        import('./features/inscripciones/view-inscripcion/view-inscripcion.component').then(m => m.ViewInscripcionComponent)
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
