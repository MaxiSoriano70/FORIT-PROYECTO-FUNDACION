import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../shared/routes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalIniciarSesionComponent } from "../modal-iniciar-sesion/modal-iniciar-sesion.component";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../shared/entities/user';
import { CommonModule } from '@angular/common';
import { ModalEditFormPerfilComponent } from '../modal-edit-form-perfil/modal-edit-form-perfil.component';
import { cerrarSesion, iniciarSesion } from '../ngrx/auth/auth.actions';
import { Sesion } from '../ngrx/auth/auth.model';
import { FullnamePipe } from '../../shared/pipes/fullname.pipe';
declare const swal: any;

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FullnamePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  routePaths = RoutePaths;
  usuario$: Observable<User | null>;

  constructor(
    private modalService: NgbModal,
    private store: Store<{ sesion: Sesion }>,
    private router: Router
  ) {
    this.usuario$ = this.store.select(state => state.sesion.usuarioLogueado);
  }


  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        this.store.dispatch(iniciarSesion({ usuario }));
      }
    }
  }

  abrirModal() {
    const modalRef = this.modalService.open(ModalIniciarSesionComponent, { centered: true });

    modalRef.result.then(
      (usuario) => {
        if (usuario && typeof localStorage !== 'undefined') {
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          this.store.dispatch(iniciarSesion({ usuario }));

          swal({
            title: `¡Bienvenido, ${usuario.email}!`,
            icon: 'success',
            timer: 2000,
            buttons: false
          });
        }
      },
      (reason) => {
        if (reason !== 'cancel' && reason !== 'Cross click' && reason !== 0) {
          swal({
            title: 'Error',
            text: 'No se inició sesión',
            icon: 'error',
            timer: 2000,
            buttons: false
          });
        }
      }
    );
  }


  cerrarSesion() {
    swal({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      buttons: ["Cancelar", "Sí, cerrar sesión"],
      dangerMode: true,
    }).then((confirmar: boolean) => {
      if (confirmar && typeof localStorage !== 'undefined') {
        localStorage.removeItem('usuarioLogueado');
        this.store.dispatch(cerrarSesion());

        this.router.navigate([this.routePaths.HOME]);
        swal({
          title: "Sesión cerrada",
          icon: "info",
          timer: 2000,
          buttons: false
        });
      }
    });
  }


  abrirModalPerfil(usuario: User) {
    const modalRef = this.modalService.open(ModalEditFormPerfilComponent, { centered: true });
    modalRef.componentInstance.user = usuario;

    modalRef.result.then(
      (updatedUser) => {
        if (updatedUser && typeof localStorage !== 'undefined') {
          localStorage.setItem('usuarioLogueado', JSON.stringify(updatedUser));
          this.store.dispatch(iniciarSesion({ usuario: updatedUser }));
          swal({
            title: `¡Perfil actualizado!`,
            icon: 'success',
            timer: 2000,
            buttons: false
          });
        }
      },
      () => { }
    );
  }

  isMenuVisible = false;

  abrirMenu() {
    this.isMenuVisible = true;
  }

  cerrarMenu() {
    this.isMenuVisible = false;
  }
}
